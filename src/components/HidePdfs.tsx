import classNames from 'classnames';

interface HidePdfsProps {
  showPdfs: boolean;
  toggleShowPdfs: () => void;
}

export default function HidePdfs({ showPdfs, toggleShowPdfs }: HidePdfsProps) {
  const HidePdfsBaseCls = `bg-blueToTest hover:bg-blueToTest2 absolute z-40 
  cursor-pointer rounded-[10px] border-[1px] border-solid border-white 
  bg-opacity-70 px-[20px] py-[10px] text-[18px] text-white 
  transition-transform duration-300 ease-in-out`;
  const showPdfsTrue = 'translate-x-[10px]';
  const showPdfsFalse = 'translate-x-[10px]';

  const HidePdfsClass = classNames({
    [HidePdfsBaseCls]: true,
    [showPdfsTrue]: true,
  });

  return (
    <div className={HidePdfsClass} onClick={() => toggleShowPdfs()}>
      {showPdfs ? (
        <div>
          Hide
          <br />
          Pdfs
        </div>
      ) : (
        <div>
          Show <br /> PDFs
        </div>
      )}
    </div>
  );
}
