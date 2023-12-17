import classNames from 'classnames';

interface HidePdfsProps {
  showPdfs: boolean;
  toggleShowPdfs: () => void;
}

export default function HidePdfs({ showPdfs, toggleShowPdfs }: HidePdfsProps) {
  const HidePdfsBaseCls = `bg-mainBlue bg-opacity-50 hover:bg-opacity-75 absolute z-40 
  cursor-pointer rounded-[10px] border-[1px] border-solid border-white 
   px-[10px] py-[10px] text-[18px] text-white 
  transition-transform duration-300 ease-in-out`;
  const showPdfsTrue = 'translate-x-[10px]';
  // const showPdfsFalse = 'translate-x-[10px]';

  const HidePdfsClass = classNames({
    [HidePdfsBaseCls]: true,
    [showPdfsTrue]: true,
  });

  return (
    <div
      className={HidePdfsClass}
      onClick={(e) => {
        e.stopPropagation();
        toggleShowPdfs();
      }}
    >
      {showPdfs ? (
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width='24'
            height='24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M15 18l-6-6 6-6' />
          </svg>
        </div>
      ) : (
        <div>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            width='24'
            height='24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M9 18l6-6-6-6' />
          </svg>
        </div>
      )}
    </div>
  );
}
