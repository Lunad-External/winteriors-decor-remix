import { useConversationSummary } from '@/hooks/useConversationSummary';

const WA_NUMBER = "971505159927";
const DEFAULT_WA_TEXT = "Hello Winteriors Decor, I would like to request a quotation or schedule a consultation.";

export const WhatsAppFloat = () => {
  const { summary } = useConversationSummary();

  const handleWhatsAppClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const messageText = summary
      ? `Hello Winteriors Decor,\n\n${summary}\n\nPlease assist me further.`
      : DEFAULT_WA_TEXT;
    const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleWhatsAppClick}
      className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full grid place-items-center bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:-translate-y-1 hover:scale-105 transition-all duration-500 cursor-pointer"
      aria-label="Chat on WhatsApp"
      type="button"
    >
      <svg viewBox="0 0 32 32" fill="currentColor" className="w-9 h-9" aria-hidden="true">
        <path d="M19.11 17.205c-.372 0-1.088 1.39-1.518 1.39a.63.63 0 0 1-.315-.1c-.802-.402-1.504-.817-2.163-1.447-.545-.516-1.146-1.29-1.46-1.963a.426.426 0 0 1-.073-.215c0-.33.99-.945.99-1.49 0-.143-.73-2.09-.832-2.335-.143-.372-.214-.487-.6-.487-.187 0-.36-.043-.53-.043-.302 0-.53.115-.746.315-.688.645-1.032 1.318-1.06 2.264v.114c-.015.99.472 1.977 1.017 2.78 1.23 1.82 2.506 3.41 4.554 4.34.616.287 2.035.888 2.722.888.817 0 2.15-.515 2.49-1.318.158-.388.158-.732.115-1.118-.13-.231-.302-.347-.531-.46-.272-.143-1.575-.774-1.79-.832a.61.61 0 0 0-.272-.043zm-2.945 7.701c-1.69 0-3.337-.515-4.74-1.405l-3.397.89.91-3.336a8.835 8.835 0 0 1-1.546-5.027c0-4.86 3.95-8.81 8.81-8.81a8.762 8.762 0 0 1 6.232 2.578 8.762 8.762 0 0 1 2.577 6.232c-.005 4.86-3.954 8.81-8.81 8.81zm0-19.299c-5.762 0-10.45 4.688-10.45 10.45 0 1.764.444 3.495 1.29 5.022l-1.376 5.027 5.142-1.347a10.418 10.418 0 0 0 4.997 1.27h.004c5.762 0 10.456-4.687 10.456-10.45a10.39 10.39 0 0 0-3.061-7.394 10.39 10.39 0 0 0-7.395-3.061z"/>
      </svg>
    </button>
  );
};
