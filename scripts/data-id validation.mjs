import fs from "fs";
import pg from "pg";

const env = fs.readFileSync(".env", "utf8");
const apiKeyMatch = env.match(/GOOGLE_API_KEY=(.*)/) || env.match(/VITE_GOOGLE_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim().replace(/^['"]|['"]$/g, "") : "";
const line = env.split("\n").find((l) => l.startsWith("DATABASE_URL="));
const dbUrl = line.substring(line.indexOf("=") + 1).trim().replace(/^['"]|['"]$/g, "");

const ROOT_FOLDER_ID = "16QKC9J8jlwU5I08rN2kh0FOhAqcG8VCs";

function slugify(text) {
    return text.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function run() {
    const pool = new pg.Pool({ connectionString: dbUrl });
    console.log("Fixing DB records with clean Google Drive File IDs...");

    const catRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${ROOT_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&key=${apiKey}`
    );
    const catData = await catRes.json();

    for (const cat of catData.files || []) {
        const categorySlug = slugify(cat.name);
        const projRes = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${cat.id}'+in+parents+and+mimeType='application/vnd.google-apps.folder'+and+trashed=false&key=${apiKey}`
        );
        const projData = await projRes.json();

        for (const p of projData.files || []) {
            const projectSlug = slugify(p.name);
            const imgRes = await fetch(
                `https://www.googleapis.com/drive/v3/files?q='${p.id}'+in+parents+and+mimeType+contains+'image/'+and+trashed=false&fields=files(id,name)&key=${apiKey}`
            );
            const imgData = await imgRes.json();

            if (imgData.files && imgData.files.length > 0) {
                const coverId = imgData.files[0].id;

                await pool.query(
                    `INSERT INTO projects (slug, title, category, drive_folder_id, cover_path, image_count, status, updated_at)
           VALUES ($1, $2, $3, $4, $5, $6, 'published', NOW())
           ON CONFLICT (slug) DO UPDATE SET
             cover_path = EXCLUDED.cover_path,
             image_count = EXCLUDED.image_count,
             updated_at = NOW();`,
                    [projectSlug, p.name, categorySlug, p.id, coverId, imgData.files.length]
                );

                for (let idx = 0; idx < imgData.files.length; idx++) {
                    const img = imgData.files[idx];
                    await pool.query(
                        `INSERT INTO project_images (project_slug, file_name, storage_path, sort_order)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (project_slug, file_name) DO UPDATE SET
               storage_path = EXCLUDED.storage_path;`,
                        [projectSlug, img.name || `0${idx + 1}.jpg`, img.id, idx]
                    );
                }
                console.log(`Updated: ${p.name} (${imgData.files.length} images) -> Cover ID: ${coverId}`);
            }
        }
    }

    await pool.end();
    console.log("SUCCESS: All DB records updated with clean Google Drive File IDs!");
}

run().catch((err) => {
    console.error("Error updating DB:", err);
    process.exit(1);
});