export default function HidePdfs({ showPdfs, toggleShowPdfs }) {
  return (
    <div
      className={`bg-mainBlue hover:bg-lightBlue absolute z-10 cursor-pointer rounded-[20px] px-[20px] py-[10px] text-white transition-transform duration-300 ease-in-out ${
        !showPdfs ? 'translate-x-[0]' : 'translate-x-[10px]'
      }`}
      onClick={() => toggleShowPdfs()}
    >
      {showPdfs ? 'Hide Pdfs' : 'Show Pdfs'}
    </div>
  );
}
