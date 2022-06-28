import type { PropsWithChildren } from 'react';

interface IPageHeader {
  title: string;
}

const PageHeader = ({ title, children }: PropsWithChildren<IPageHeader>) => (
  <div className='flex justify-between items-center'>
    <h1 className='text--heading-1'>{title}</h1>
    {children}
  </div>
);

export default PageHeader;
