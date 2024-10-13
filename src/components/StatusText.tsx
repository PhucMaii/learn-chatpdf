  import React, { useEffect, useState } from 'react';
  
  export enum COLOR_TYPE {
    SUCCESS = 'success',
    WARNING = 'warning',
    ERROR = 'error',
    INFO = 'info',
    DEFAULT = 'default',
  }
  
  interface PropTypes {
    text: string;
    type: string;
    icon?: React.ReactNode;
  }
  
  interface TextColorType {
    backgroundColor: string;
    color: string;
  }
  
  export default function StatusText({ text, type, icon }: PropTypes) {
    const [textColor, setTextColor] = useState<TextColorType>({
      backgroundColor: '',
      color: '',
    });
  
    useEffect(() => {
      getColor();
    }, [type]);
  
    const getColor = () => {
      if (type === 'success') {
        setTextColor({
          backgroundColor: 'bg-green-200',
          color: 'text-green-800',
        });
      }
      if (type === 'info') {
        setTextColor({
            backgroundColor: 'bg-blue-200',
            color: 'text-blue-800',
        });
      }
      if (type === 'warning') {
        setTextColor({
            backgroundColor: 'bg-yellow-200',
            color: 'text-yellow-800',
        });
      }
      if (type === 'error') {
        setTextColor({
            backgroundColor: 'bg-red-200',
            color: 'text-red-800',
        });
      }
    };
  
    return (
      <div
        // display="flex"
        // alignItems="center"
        // gap={1}
        // sx={{
        //   ...textColor,
        //   borderRadius: 2,
        //   textAlign: 'center',
        //   py: '5px',
        //   px: '10px',
        //   width: 'fit-content',
        // }}
        className={`flex items-center gap-1 rounded-lg ${textColor.backgroundColor} ${textColor.color} py-1 px-4 w-fit`}
      >
        {icon}
        <h6
        // sx={{
        //   ...textColor,
        //   borderRadius: 2,
        //   textAlign: 'center',
        //   py: '5px',
        //   px: '10px',
        //   width: 'fit-content',
        // }}
        className={`text-sm ${textColor.color} font-bold items-center w-fit`}
        >
          {text}
        </h6>
      </div>
    );
  }
  