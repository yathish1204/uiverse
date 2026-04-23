import imgImageDesignSystemsTheFutureOfScalableUi from "figma:asset/2f0d4a3df6e59c2b37da4b598180269662090d4b.png";
import imgPerson01 from "figma:asset/9f5b2a8303b2ff9488563ea527eb09af734c015e.png";
import imgPerson02 from "figma:asset/742e3cf58ea17e6bf8633182c03667c050a43681.png";

function ImageDesignSystemsTheFutureOfScalableUi() {
  return (
    <div className="absolute h-[280.763px] left-0 opacity-95 top-0 w-[498.668px]" data-name="Image (Design Systems: The Future of Scalable UI)">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImageDesignSystemsTheFutureOfScalableUi} />
    </div>
  );
}

function Container3() {
  return <div className="absolute bg-gradient-to-t from-black h-[280.763px] left-0 to-[rgba(0,0,0,0)] top-0 via-1/2 via-[rgba(0,0,0,0)] w-[498.668px]" data-name="Container" />;
}

function Text() {
  return (
    <div className="bg-gradient-to-r from-[rgba(208,135,0,0.9)] h-[23.636px] relative rounded-[24036824px] shrink-0 to-[rgba(166,95,0,0.9)] w-full" data-name="Text">
      <div aria-hidden="true" className="absolute border-[0.716px] border-[rgba(240,177,0,0.5)] border-solid inset-0 pointer-events-none rounded-[24036824px]" />
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14.327px] left-[12.33px] not-italic text-[10.029px] text-white top-[4.3px] whitespace-nowrap">Design</p>
    </div>
  );
}

function Container4() {
  return (
    <div className="absolute content-stretch flex flex-col h-[17.19px] items-start left-[11.98px] pl-[-0.003px] pr-[0.003px] pt-[-2.867px] top-[11.77px] w-[55.169px]" data-name="Container">
      <Text />
    </div>
  );
}

function Container5() {
  return (
    <div className="absolute h-[14.325px] left-[456.31px] top-[11.78px] w-[30.092px]" data-name="Container">
      <p className="absolute font-['Inter:Regular',sans-serif] font-normal leading-[14.327px] not-italic right-[30.19px] text-[10.029px] text-[rgba(255,255,255,0.8)] top-[-0.71px] translate-x-full whitespace-nowrap">45 min</p>
    </div>
  );
}

function Container2() {
  return (
    <div className="absolute bg-black h-[280.763px] left-0 overflow-clip top-[-0.17px] w-[498.668px]" data-name="Container">
      <ImageDesignSystemsTheFutureOfScalableUi />
      <Container3 />
      <Container4 />
      <Container5 />
    </div>
  );
}

function Heading() {
  return (
    <div className="content-stretch flex h-[22.919px] items-start relative shrink-0 w-full" data-name="Heading 3">
      <p className="flex-[1_0_0] font-['Inter:Medium',sans-serif] font-medium leading-[22.923px] min-w-px not-italic relative text-[#fefce8] text-[17.192px]">Design Systems: The Future of Scalable UI</p>
    </div>
  );
}

function Container6() {
  return (
    <div className="absolute content-stretch flex flex-col h-[63.028px] items-start left-0 pl-[17.192px] pr-[17.193px] pt-[17.161px] top-[280.3px] w-[498.668px]" style={{ backgroundImage: "linear-gradient(172.796deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.9) 100%)" }} data-name="Container">
      <Heading />
    </div>
  );
}

function Container1() {
  return (
    <div className="absolute border-[1.433px] border-[rgba(208,135,0,0.3)] border-solid h-[346.656px] left-0 overflow-clip rounded-[11.462px] shadow-[0px_17.909px_35.818px_-8.596px_rgba(0,0,0,0.25)] top-0 w-[501.534px]" style={{ backgroundImage: "linear-gradient(145.348deg, rgba(115, 62, 10, 0.2) 0%, rgba(0, 0, 0, 0.5) 100%)" }} data-name="Container">
      <Container2 />
      <Container6 />
    </div>
  );
}

function Container() {
  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute bg-black blur-[0px] h-[346.656px] left-[calc(50%-83.88px)] top-[calc(50%-9.36px)] w-[501.534px]" data-name="Container">
      <Container1 />
    </div>
  );
}

function Frame() {
  return (
    <div className="bg-[red] content-stretch flex items-center justify-center px-[10px] py-[4px] relative w-[268.695px]">
      <div className="flex h-[40.645px] items-center justify-center relative shrink-0 w-[181.229px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="flex-none rotate-[-0.51deg]">
          <p className="font-['Inter:Bold',sans-serif] font-bold leading-[normal] not-italic relative text-[32px] text-white whitespace-nowrap">John Jacob</p>
        </div>
      </div>
    </div>
  );
}

function Presenter() {
  return (
    <div className="absolute h-[347.371px] left-[519px] top-[18px] w-[319.22px]" data-name="Presenter">
      <div className="absolute flex h-[340.183px] items-center justify-center left-0 top-0 w-[317.225px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "322" } as React.CSSProperties}>
        <div className="-rotate-4 -skew-x-4 flex-none">
          <div className="relative size-[318px]" data-name="Person-01">
            <img alt="" className="absolute block inset-0 max-w-none size-full" height="318" src={imgPerson01} width="318" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[340.183px] items-center justify-center left-[2px] top-[2.86px] w-[317.225px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "322" } as React.CSSProperties}>
        <div className="-rotate-4 -skew-x-4 flex-none">
          <div className="relative size-[318px]" data-name="person-02">
            <img alt="" className="absolute block inset-0 max-w-none size-full" height="318" src={imgPerson02} width="318" />
          </div>
        </div>
      </div>
      <div className="absolute flex h-[67.388px] items-center justify-center left-[36.96px] top-[279.98px] w-[268.041px]" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "21" } as React.CSSProperties}>
        <div className="-rotate-4 -skew-x-4 flex-none">
          <Frame />
        </div>
      </div>
    </div>
  );
}

function Dates() {
  return (
    <div className="absolute content-stretch flex flex-col font-['Inter:Bold',sans-serif] font-bold items-start leading-[normal] left-0 not-italic text-white top-[255px] w-[67.171px]" data-name="Dates">
      <p className="relative shrink-0 text-[52.925px] w-full">22</p>
      <p className="relative shrink-0 text-[23.155px] w-full">APRIL</p>
    </div>
  );
}

export default function Component() {
  return (
    <div className="relative size-full" data-name="001">
      <Container />
      <Presenter />
      <Dates />
    </div>
  );
}