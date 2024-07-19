import { NextPage } from 'next';
import { ReactNode } from 'react';

export type NextPageWithLayout = NextPage & {
    layout?: (page: ReactNode) => ReactNode;
};
