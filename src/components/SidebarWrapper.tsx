import React from 'react';
import Sidebar from './Sidebar';

type Props = {
  children: React.ReactNode;
};

const SidebarWrapper = ({ children }: Props) => {
  return (
    <div className="flex">
      <div className="flex-[2] p-4 border-r-4 border-1-slate-200">
        <Sidebar />
      </div>
      <div className="flex-[8] p-4">{children}</div>
    </div>
  );
};

export default SidebarWrapper;
