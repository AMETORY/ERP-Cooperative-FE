import { createContext, useState } from 'react';

export const LoadingContext = createContext<{
  loading: boolean;
  setLoading: (loading: boolean) => void;
}>({
  loading: false,
  setLoading: () => {},
});

export const DateRangeContext = createContext<{
  dateRange: [Date, Date] | null;
  setDateRange: (dateRange: [Date, Date] | null) => void;
}>({
  dateRange: null,
  setDateRange: () => {},
});
