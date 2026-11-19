import { describe, it, expect } from "vitest";
import { driveFileId } from "./drive-link";

const ID = "1AbCdEfGhIjKlMnOpQrStUvWxYz_-0123";

describe("driveFileId", () => {
  it("reads share links, id= links and bare ids", () => {
    expect(driveFileId(`https://drive.google.com/file/d/${ID}/view?usp=sharing`)).toBe(ID);
    expect(driveFileId(`https://drive.google.com/open?id=${ID}`)).toBe(ID);
    expect(driveFileId(`https://drive.google.com/uc?export=view&id=${ID}`)).toBe(ID);
    expect(driveFileId(`  ${ID} `)).toBe(ID);
  });

  it("rejects anything else", () => {
    expect(driveFileId("https://example.com/photo.jpg")).toBeNull();
    expect(driveFileId("short_id")).toBeNull();
    expect(driveFileId("")).toBeNull();
  });
});
