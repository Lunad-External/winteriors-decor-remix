import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface ConversationSummaryContextType {
  summary: string;
  setSummary: (summary: string) => void;
  clearSummary: () => void;
}

const ConversationSummaryContext = createContext<ConversationSummaryContextType | undefined>(undefined);

export const ConversationSummaryProvider = ({ children }: { children: ReactNode }) => {
  const [summary, setSummaryState] = useState<string>('');

  const setSummary = useCallback((newSummary: string) => {
    setSummaryState(newSummary);
  }, []);

  const clearSummary = useCallback(() => {
    setSummaryState('');
  }, []);

  return (
    <ConversationSummaryContext.Provider value={{ summary, setSummary, clearSummary }}>
      {children}
    </ConversationSummaryContext.Provider>
  );
};

const defaultContext: ConversationSummaryContextType = {
  summary: '',
  setSummary: () => {},
  clearSummary: () => {},
};

export const useConversationSummary = () => {
  const context = useContext(ConversationSummaryContext);
  return context ?? defaultContext;
};
