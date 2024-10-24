import { OctagonAlertIcon } from 'lucide-react';
import React from 'react';

type Props = {
  errorText: string;
};

const ErrorComponent = ({ errorText }: Props) => {
  return (
    <div
      className="flex flex-col justify-center items-center mt-4 w-full"
      //   display="flex"
      //   flexDirection="column"
      //   justifyContent="center"
      //   alignItems="center"
      //   mt={4}
      //   sx={{ width: '100%' }}
    >
      <OctagonAlertIcon className="w-6 h-6 text-gray-400" />
      <h6 className="text-lg text-gray-400 font-bold items-center text-center w-fit">
        {errorText}
      </h6>
    </div>
  );
};

export default ErrorComponent;
