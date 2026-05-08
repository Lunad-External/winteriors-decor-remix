import { Phone } from 'lucide-react';

const DUBAI_NUMBER = "+971505159927";
const ABU_DHABI_NUMBER = "+971503217569";

export const CallFloat = () => {
  return (
    <div className="fixed top-24 md:top-40 left-0 right-0 z-[60] pointer-events-none">
      <div className="max-w-[1600px] mx-auto px-4 flex justify-end">
        <div className="inline-flex flex-col items-end gap-2 pointer-events-auto">
          <a
            href={`tel:${DUBAI_NUMBER}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-auto"
            aria-label={`Call Dubai office at ${DUBAI_NUMBER}`}
          >
            <span className="font-medium text-sm tracking-wide leading-none">Dubai</span>
            <Phone size={14} />
          </a>
          <a
            href={`tel:${ABU_DHABI_NUMBER}`}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 w-auto"
            aria-label={`Call Abu Dhabi office at ${ABU_DHABI_NUMBER}`}
          >
            <span className="font-medium text-sm tracking-wide leading-none">Abu Dhabi</span>
            <Phone size={14} />
          </a>
        </div>
      </div>
    </div>
  );
};
