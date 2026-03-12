import svgPaths from "./svg-pub605q2s6";

function Svg() {
  return (
    <div
      className="absolute left-1/2 size-[17.5px] top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="SVG"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="SVG">
          <path
            d={svgPaths.p32dd8c80}
            id="Vector"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d={svgPaths.p3ab04900}
            id="Vector_2"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d="M7.29167 6.5625H5.83333"
            id="Vector_3"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d="M11.6667 9.47917H5.83333"
            id="Vector_4"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d="M11.6667 12.3958H5.83333"
            id="Vector_5"
            stroke="var(--stroke-0, white)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
        </g>
      </svg>
    </div>
  );
}

function Background() {
  return (
    <div
      className="absolute bg-[#0073ea] left-3.5 rounded-[7px] size-7 translate-y-[-50%]"
      data-name="Background"
      style={{ top: "calc(50% - 0.5px)" }}
    >
      <Svg />
    </div>
  );
}

function Heading1() {
  return (
    <div
      className="absolute h-[24.5px] left-[52.5px] overflow-clip right-[46.69px] top-[8.25px]"
      data-name="Heading 1"
    >
      <div className="absolute flex flex-col font-['Tahoma:Bold',_sans-serif] h-[22px] justify-center leading-[0] left-0 not-italic text-[#323338] text-[17.5px] text-left top-3 translate-y-[-50%] w-[64.276px]">
        <p className="block leading-[24.5px]">WOOPI AI</p>
      </div>
    </div>
  );
}

function Container() {
  return (
    <div
      className="absolute h-3.5 left-[52.5px] overflow-clip right-[46.69px] top-[32.75px]"
      data-name="Container"
    >
      <div className="absolute flex flex-col font-['Tahoma:Regular',_sans-serif] h-[13px] justify-center leading-[0] left-0 not-italic text-[#676879] text-[10.5px] text-left top-[6.5px] translate-y-[-50%] w-[124.202px]">
        <p className="block leading-[14px]">Gestão inteligente de Docs</p>
      </div>
    </div>
  );
}

function HorizontalBorder() {
  return (
    <div
      className="absolute h-14 left-0 right-px top-0"
      data-name="HorizontalBorder"
    >
      <div className="absolute border-[#d0d4d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <Background />
      <Heading1 />
      <Container />
    </div>
  );
}

function Svg1() {
  return (
    <div
      className="absolute left-[10.5px] size-[17.5px] top-1/2 translate-y-[-50%]"
      data-name="SVG"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="SVG">
          <path
            d={svgPaths.p32dd8c80}
            id="Vector"
            stroke="var(--stroke-0, #0D6EFD)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d={svgPaths.p3ab04900}
            id="Vector_2"
            stroke="var(--stroke-0, #0D6EFD)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d="M7.29167 6.5625H5.83333"
            id="Vector_3"
            stroke="var(--stroke-0, #0D6EFD)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d="M11.6667 9.47917H5.83333"
            id="Vector_4"
            stroke="var(--stroke-0, #0D6EFD)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d="M11.6667 12.3958H5.83333"
            id="Vector_5"
            stroke="var(--stroke-0, #0D6EFD)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
        </g>
      </svg>
    </div>
  );
}

function Container1() {
  return (
    <div
      className="absolute h-[17.5px] left-[38.5px] overflow-clip top-1/2 translate-y-[-50%] w-[67.23px]"
      data-name="Container"
    >
      <div
        className="absolute flex flex-col font-['Tahoma:Regular',_sans-serif] h-[15px] justify-center leading-[0] not-italic text-[#0d6efd] text-[12.1078px] text-center top-[8.5px] translate-x-[-50%] translate-y-[-50%] w-[67.43px]"
        style={{ left: "calc(50% + 0.0999985px)" }}
      >
        <p className="block leading-[17.5px]">Documentos</p>
      </div>
    </div>
  );
}

function Button() {
  return (
    <div
      className="absolute bg-[#e1e9f8] h-[38.5px] left-3.5 right-3.5 rounded-[7px] top-[21px]"
      data-name="Button"
    >
      <Svg1 />
      <Container1 />
    </div>
  );
}

function Svg2() {
  return (
    <div
      className="absolute left-[10.5px] size-[17.5px] top-1/2 translate-y-[-50%]"
      data-name="SVG"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 18 18"
      >
        <g id="SVG">
          <path
            d={svgPaths.p1968dd00}
            id="Vector"
            stroke="var(--stroke-0, #424856)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d={svgPaths.p2a20d780}
            id="Vector_2"
            stroke="var(--stroke-0, #424856)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d={svgPaths.p39d7a960}
            id="Vector_3"
            stroke="var(--stroke-0, #424856)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
          <path
            d={svgPaths.p31bf6a00}
            id="Vector_4"
            stroke="var(--stroke-0, #424856)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.45833"
          />
        </g>
      </svg>
    </div>
  );
}

function Container2() {
  return (
    <div
      className="absolute h-[17.5px] left-[38.5px] overflow-clip top-1/2 translate-y-[-50%] w-[104.25px]"
      data-name="Container"
    >
      <div
        className="absolute flex flex-col font-['Tahoma:Regular',_sans-serif] h-[15px] justify-center leading-[0] not-italic text-[#424856] text-[12.1078px] text-center top-[8.5px] translate-x-[-50%] translate-y-[-50%] w-[104.45px]"
        style={{ left: "calc(50% + 0.0999985px)" }}
      >
        <p className="block leading-[17.5px]">Gestão de Usuários</p>
      </div>
    </div>
  );
}

function Button4() {
  return (
    <div
      className="absolute h-[38.5px] left-3.5 overflow-clip right-3.5 rounded-[7px] top-[63px]"
      data-name="Button"
    >
      <Svg2 />
      <Container2 />
    </div>
  );
}

function Nav() {
  return (
    <div
      className="absolute bottom-[57px] left-0 overflow-auto right-px top-14"
      data-name="Nav"
    >
      <Button />
      <Button4 />
    </div>
  );
}

function ButtonSvg() {
  return (
    <div
      className="absolute left-1/2 size-3.5 translate-x-[-50%] translate-y-[-50%]"
      data-name="Button → SVG"
      style={{ top: "calc(50% + 0.5px)" }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g id="Button â SVG">
          <path
            d="M8.75 10.5L5.25 7L8.75 3.5"
            id="Vector"
            stroke="var(--stroke-0, #323338)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function HorizontalBorder1() {
  return (
    <div
      className="absolute h-[57px] left-0 right-px top-[843px]"
      data-name="HorizontalBorder"
    >
      <div className="absolute border-[#d0d4d9] border-[1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <ButtonSvg />
    </div>
  );
}

function Aside() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-0 top-0 w-56"
      data-name="Aside"
    >
      <div className="absolute border-[#d0d4d9] border-[0px_1px_0px_0px] border-solid inset-0 pointer-events-none" />
      <HorizontalBorder />
      <Nav />
      <HorizontalBorder1 />
    </div>
  );
}

function Menu1() {
  return (
    <div className="absolute left-[21px] size-8 top-3.5" data-name="Menu 1">
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 32 32"
      >
        <g id="Menu 1">
          <path
            d={svgPaths.p11873d80}
            fill="var(--fill-0, #171A1F)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Group3466583() {
  return (
    <div className="absolute contents left-[306px] top-[17px]">
      <div className="absolute left-[306px] size-7 top-[17px]">
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 28 28"
        >
          <circle
            cx="14"
            cy="14"
            fill="var(--fill-0, #1C3C6E)"
            id="Ellipse 3393"
            r="14"
          />
        </svg>
      </div>
      <div className="absolute font-['Tahoma:Regular',_sans-serif] leading-[0] left-[313px] not-italic text-[#ffffff] text-[10.5px] text-left text-nowrap top-6">
        <p className="block leading-[14px] whitespace-pre">TN</p>
      </div>
    </div>
  );
}

function Main() {
  return (
    <div
      className="absolute bg-[#f8f9fb] bottom-0 left-0 overflow-auto right-0 top-14"
      data-name="Main"
    >
      <div className="absolute flex flex-col font-['Tahoma:Bold',_sans-serif] h-7 justify-center leading-[0] left-[66px] not-italic text-[#323338] text-[21px] text-left top-[35px] translate-y-[-50%] w-[203.088px]">
        <p className="block leading-[28px]">Documentos</p>
      </div>
      <div className="absolute flex flex-col font-['Tahoma:Regular',_sans-serif] h-[18.38px] justify-center leading-[0] left-[21px] not-italic text-[#676879] text-[12.3px] text-left top-[58.19px] translate-y-[-50%] w-[270.167px]">
        <p className="block leading-[18.38px]">
          Gerencie documentos e extraia informações
        </p>
      </div>
      <Menu1 />
      <Group3466583 />
    </div>
  );
}

function Container16() {
  return (
    <div
      className="absolute bg-[#ffffff] h-[42.097px] left-[21px] rounded-[5.37407px] shadow-[0px_0px_1.79136px_0px_rgba(23,26,31,0.12),0px_0px_0.895678px_0px_rgba(23,26,31,0.07)] top-[209.863px] w-[1184.98px]"
      data-name="Container 16"
    >
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[16.12px] not-italic text-[#9095a1] text-[14.3309px] text-left text-nowrap top-[10.748px]">
        <p className="block leading-[23.2876px] whitespace-pre">
          Nome ou descricao do documento
        </p>
      </div>
    </div>
  );
}

function Frame() {
  return (
    <div
      className="absolute bg-gray-100 bottom-0 left-[59.146%] right-[25.642%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[10.747px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[158.759px]"
          style={{ top: "calc(50% - 9.85225px)" }}
        >
          <p className="block leading-[19.7049px]">Data de inclusão</p>
        </div>
      </div>
      <div className="absolute border-[#bdc1ca] border-[0.895678px_0px] border-solid bottom-[-0.448px] left-0 pointer-events-none right-0 top-[-0.448px]" />
    </div>
  );
}

function Frame1() {
  return (
    <div
      className="absolute bg-gray-100 bottom-0 left-[5.593%] right-[76.02%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[10.749px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[196.377px]"
          style={{ top: "calc(50% - 9.85225px)" }}
        >
          <p className="block leading-[19.7049px]">Nome de doc.</p>
        </div>
      </div>
      <div className="absolute border-[#bdc1ca] border-[0.895678px_0px] border-solid bottom-[-0.448px] left-0 pointer-events-none right-0 top-[-0.448px]" />
    </div>
  );
}

function Frame2() {
  return (
    <div
      className="absolute bg-gray-100 bottom-0 left-[85.393%] right-0 top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] not-italic text-[#565d6d] text-[12.5395px] text-center translate-x-[-50%] w-[151.594px]"
          style={{
            top: "calc(50% - 9.85225px)",
            left: "calc(50% - 0.33683px)",
          }}
        >
          <p className="block leading-[19.7049px]">Ação</p>
        </div>
      </div>
      <div className="absolute border-[#bdc1ca] border-[0.895678px_0px] border-solid bottom-[-0.448px] left-0 pointer-events-none right-0 top-[-0.448px]" />
    </div>
  );
}

function Frame3() {
  return (
    <div
      className="absolute bg-gray-100 bottom-0 left-0 right-[94.407%] top-0"
      data-name="Frame"
    >
      <div className="absolute border-[#bdc1ca] border-[0.895678px_0px] border-solid bottom-[-0.448px] left-0 pointer-events-none right-0 top-[-0.448px]" />
    </div>
  );
}

function Frame4() {
  return (
    <div
      className="absolute bg-gray-100 bottom-0 left-[74.357%] right-[14.607%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[10.749px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[109.273px]"
          style={{ top: "calc(50% - 9.85225px)" }}
        >
          <p className="block leading-[19.7049px]">Status</p>
        </div>
      </div>
      <div className="absolute border-[#bdc1ca] border-[0.895678px_0px] border-solid bottom-[-0.448px] left-0 pointer-events-none right-0 top-[-0.448px]" />
    </div>
  );
}

function Frame5() {
  return (
    <div
      className="absolute bg-gray-100 bottom-0 left-[23.98%] right-[40.854%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Medium',_sans-serif] font-medium leading-[0] left-[10.747px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[395.218px]"
          style={{ top: "calc(50% - 9.85225px)" }}
        >
          <p className="block leading-[19.7049px]">Descrição</p>
        </div>
      </div>
      <div className="absolute border-[#bdc1ca] border-[0.895678px_0px] border-solid bottom-[-0.448px] left-0 pointer-events-none right-0 top-[-0.448px]" />
    </div>
  );
}

function Header() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] bottom-[88.889%] left-0 right-0 top-0"
      data-name="Header"
    >
      <Frame />
      <Frame1 />
      <Frame2 />
      <Frame3 />
      <Frame4 />
      <Frame5 />
    </div>
  );
}

function Delete() {
  return (
    <div
      className="absolute size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="delete"
      style={{
        top: "calc(50% - 0.000887871px)",
        left: "calc(50% - 0.00154209px)",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="delete">
          <path
            d={svgPaths.p37560f40}
            fill="var(--fill-0, #0D6EFD)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame6() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-0 right-[94.407%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Delete />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame7() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-[59.146%] right-[25.642%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#379ae6] text-[12.5395px] text-left w-[158.759px]"
          style={{ top: "calc(50% - 9.85335px)" }}
        >
          <p className="block leading-[19.7049px]">11/06/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame8() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-[23.98%] right-[40.854%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#171a1f] text-[12.5395px] text-left w-[393.427px]"
          style={{ top: "calc(50% - 9.85335px)" }}
        >
          <p className="block leading-[19.7049px] whitespace-pre-wrap">{`DOCNAME  22014155454`}</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button6() {
  return (
    <div
      className="absolute bg-[#0d6efd] h-[32.244px] overflow-clip rounded-[5.37407px] translate-x-[-50%] translate-y-[-50%] w-[79.715px]"
      data-name="Button"
      style={{
        top: "calc(50% - 0.000588894px)",
        left: "calc(50% + 0.000602722px)",
      }}
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#ffffff] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.85297px)", left: "calc(50% - 29.1111px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">ANALISAR</p>
      </div>
    </div>
  );
}

function Frame9() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-[85.393%] right-0 top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Button6 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame10() {
  return (
    <div
      className="absolute bg-[#f0f6ff] h-[25.079px] left-[0.001px] overflow-clip rounded-[12.5395px] top-0 w-[85.985px]"
      data-name="Frame"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#0d6efd] text-[10.7481px] text-left text-nowrap"
        style={{ top: "calc(50% - 8.95596px)", left: "calc(50% - 35.8252px)" }}
      >
        <p className="block leading-[17.9136px] whitespace-pre">
          Não analisado
        </p>
      </div>
    </div>
  );
}

function Tag() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-[25.079px] left-[10.749px] translate-y-[-50%] w-[85.985px]"
      data-name="Tag"
      style={{ top: "calc(50% - 0.000901222px)" }}
    >
      <Frame10 />
    </div>
  );
}

function Frame11() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-[74.357%] right-[14.607%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Tag />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame12() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-[5.593%] right-[76.02%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.749px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[194.586px]"
          style={{ top: "calc(50% - 9.85335px)" }}
        >
          <p className="block leading-[19.7049px]">596 9 27749/2019</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Row() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] bottom-[77.778%] left-0 right-0 top-[11.111%]"
      data-name="Row"
    >
      <Frame6 />
      <Frame7 />
      <Frame8 />
      <Frame9 />
      <Frame11 />
      <Frame12 />
    </div>
  );
}

function Button7() {
  return (
    <div
      className="absolute bg-[#0d6efd] h-[32.244px] overflow-clip rounded-[5.37407px] translate-x-[-50%] translate-y-[-50%] w-[79.715px]"
      data-name="Button"
      style={{
        top: "calc(50% - 0.000714302px)",
        left: "calc(50% + 0.000602722px)",
      }}
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#ffffff] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.85309px)", left: "calc(50% - 29.1111px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">ANALISAR</p>
      </div>
    </div>
  );
}

function Frame13() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-[85.393%] right-0 top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Button7 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame14() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-[23.98%] right-[40.854%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#171a1f] text-[12.5395px] text-left w-[393.427px]"
          style={{ top: "calc(50% - 9.85348px)" }}
        >
          <p className="block leading-[19.7049px] whitespace-pre-wrap">{`DOCNAME  22014155454`}</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Delete1() {
  return (
    <div
      className="absolute size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="delete"
      style={{
        top: "calc(50% - 0.00101185px)",
        left: "calc(50% - 0.00154209px)",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="delete">
          <path
            d={svgPaths.p8a71980}
            fill="var(--fill-0, #0D6EFD)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame15() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-0 right-[94.407%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Delete1 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame16() {
  return (
    <div
      className="absolute bg-[#f0f6ff] h-[25.079px] left-[0.001px] overflow-clip rounded-[12.5395px] top-0 w-[85.985px]"
      data-name="Frame"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#0d6efd] text-[10.7481px] text-left text-nowrap"
        style={{ top: "calc(50% - 8.95706px)", left: "calc(50% - 35.8252px)" }}
      >
        <p className="block leading-[17.9136px] whitespace-pre">
          Não analisado
        </p>
      </div>
    </div>
  );
}

function Tag1() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-[25.079px] left-[10.749px] top-1/2 translate-y-[-50%] w-[85.985px]"
      data-name="Tag"
    >
      <Frame16 />
    </div>
  );
}

function Frame17() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-[74.357%] right-[14.607%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Tag1 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame18() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-[59.146%] right-[25.642%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#379ae6] text-[12.5395px] text-left w-[158.759px]"
          style={{ top: "calc(50% - 9.85348px)" }}
        >
          <p className="block leading-[19.7049px]">19/04/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame19() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-[5.593%] right-[76.02%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[10.749px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[194.586px]"
          style={{ top: "calc(50% - 9.85348px)" }}
        >
          <p className="block leading-[19.7049px]">596 9 405590/2022</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Row1() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] bottom-[66.666%] left-0 right-0 top-[22.222%]"
      data-name="Row"
    >
      <Frame13 />
      <Frame14 />
      <Frame15 />
      <Frame17 />
      <Frame18 />
      <Frame19 />
    </div>
  );
}

function Frame20() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-[5.593%] right-[76.02%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[10.749px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[194.586px]"
          style={{ top: "calc(50% - 9.85264px)" }}
        >
          <p className="block leading-[19.7049px]">596 9 102795/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Delete2() {
  return (
    <div
      className="absolute size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="delete"
      style={{
        top: "calc(50% - 0.000170708px)",
        left: "calc(50% - 0.00154209px)",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="delete">
          <path
            d={svgPaths.pce14d00}
            fill="var(--fill-0, #0D6EFD)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame21() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[0.001%] left-0 right-[94.407%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Delete2 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame22() {
  return (
    <div
      className="absolute bg-[#f0f6ff] h-[25.079px] left-[0.001px] overflow-clip rounded-[12.5395px] top-0 w-[85.985px]"
      data-name="Frame"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#0d6efd] text-[10.7481px] text-left text-nowrap"
        style={{ top: "calc(50% - 8.95719px)", left: "calc(50% - 35.8252px)" }}
      >
        <p className="block leading-[17.9136px] whitespace-pre">
          Não analisado
        </p>
      </div>
    </div>
  );
}

function Tag2() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-[25.079px] left-[10.749px] translate-y-[-50%] w-[85.985px]"
      data-name="Tag"
      style={{ top: "calc(50% - 0.000184059px)" }}
    >
      <Frame22 />
    </div>
  );
}

function Frame23() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-[74.357%] right-[14.607%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Tag2 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button10() {
  return (
    <div
      className="absolute bg-[#0d6efd] h-[32.244px] overflow-clip rounded-[5.37407px] translate-x-[-50%] translate-y-[-50%] w-[79.715px]"
      data-name="Button"
      style={{
        top: "calc(50% - 0.000839233px)",
        left: "calc(50% + 0.000602722px)",
      }}
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#ffffff] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.85225px)", left: "calc(50% - 29.1111px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">ANALISAR</p>
      </div>
    </div>
  );
}

function Frame24() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-[85.393%] right-0 top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Button10 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame25() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-[59.146%] right-[25.642%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#379ae6] text-[12.5395px] text-left w-[158.759px]"
          style={{ top: "calc(50% - 9.85264px)" }}
        >
          <p className="block leading-[19.7049px]">28/10/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame26() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-0 left-[23.98%] right-[40.854%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#171a1f] text-[12.5395px] text-left w-[393.427px]"
          style={{ top: "calc(50% - 9.85264px)" }}
        >
          <p className="block leading-[19.7049px] whitespace-pre-wrap">{`DOCNAME  22014155454`}</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Row2() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] bottom-[55.555%] left-0 right-0 top-[33.334%]"
      data-name="Row"
    >
      <Frame20 />
      <Frame21 />
      <Frame23 />
      <Frame24 />
      <Frame25 />
      <Frame26 />
    </div>
  );
}

function Frame27() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[0.001%] left-[59.146%] right-[25.642%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#379ae6] text-[12.5395px] text-left w-[158.759px]"
          style={{ top: "calc(50% - 9.85276px)" }}
        >
          <p className="block leading-[19.7049px]">10/02/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Delete3() {
  return (
    <div
      className="absolute size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="delete"
      style={{
        top: "calc(50% - 0.000296593px)",
        left: "calc(50% - 0.00154209px)",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="delete">
          <path
            d={svgPaths.p38424380}
            fill="var(--fill-0, #0D6EFD)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame28() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[0.001%] left-0 right-[94.407%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Delete3 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame29() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[0.001%] left-[23.98%] right-[40.854%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#171a1f] text-[12.5395px] text-left w-[393.427px]"
          style={{ top: "calc(50% - 9.85276px)" }}
        >
          <p className="block leading-[19.7049px] whitespace-pre-wrap">{`DOCNAME  22014155454`}</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame30() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[0.001%] left-[5.593%] right-[76.02%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[10.749px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[194.586px]"
          style={{ top: "calc(50% - 9.85276px)" }}
        >
          <p className="block leading-[19.7049px]">596 9 48898/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button11() {
  return (
    <div
      className="absolute bg-[#0eaa42] h-[32.244px] overflow-clip rounded-[5.37407px] translate-x-[-50%] translate-y-[-50%] w-[94.046px]"
      data-name="Button"
      style={{
        top: "calc(50% - 0.000964642px)",
        left: "calc(50% - 0.000701904px)",
      }}
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#ffffff] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.8514px)", left: "calc(50% - 36.2753px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">CONSULTAR</p>
      </div>
    </div>
  );
}

function Frame31() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[0.001%] left-[85.393%] right-0 top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Button11 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame32() {
  return (
    <div
      className="absolute bg-[#edfef2] h-[25.079px] left-[0.001px] overflow-clip rounded-[12.5395px] top-0 w-[63.593px]"
      data-name="Frame"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#0eaa42] text-[10.7481px] text-left text-nowrap"
        style={{ top: "calc(50% - 8.95635px)", left: "calc(50% - 24.6293px)" }}
      >
        <p className="block leading-[17.9136px] whitespace-pre">Analisado</p>
      </div>
    </div>
  );
}

function Tag3() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-[25.079px] left-[10.749px] translate-y-[-50%] w-[63.593px]"
      data-name="Tag"
      style={{ top: "calc(50% - 0.000309944px)" }}
    >
      <Frame32 />
    </div>
  );
}

function Frame33() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[0.001%] left-[74.357%] right-[14.607%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Tag3 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Row3() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] bottom-[44.444%] left-0 right-0 top-[44.444%]"
      data-name="Row"
    >
      <Frame27 />
      <Frame28 />
      <Frame29 />
      <Frame30 />
      <Frame31 />
      <Frame33 />
    </div>
  );
}

function Delete4() {
  return (
    <div
      className="absolute size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="delete"
      style={{
        top: "calc(50% - 0.00139713px)",
        left: "calc(50% - 0.00154209px)",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="delete">
          <path
            d={svgPaths.p9c9cc00}
            fill="var(--fill-0, #0D6EFD)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame34() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[0.001%] left-0 right-[94.407%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Delete4 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame35() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[0.001%] left-[59.146%] right-[25.642%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#379ae6] text-[12.5395px] text-left w-[158.759px]"
          style={{ top: "calc(50% - 9.85386px)" }}
        >
          <p className="block leading-[19.7049px]">09/03/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame36() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[0.001%] left-[23.98%] right-[40.854%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#171a1f] text-[12.5395px] text-left w-[393.427px]"
          style={{ top: "calc(50% - 9.85386px)" }}
        >
          <p className="block leading-[19.7049px] whitespace-pre-wrap">{`DOCNAME  22014155454`}</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame37() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[0.001%] left-[5.593%] right-[76.02%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[10.749px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[194.586px]"
          style={{ top: "calc(50% - 9.85386px)" }}
        >
          <p className="block leading-[19.7049px]">596 9 35080/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame38() {
  return (
    <div
      className="absolute bg-[#f0f6ff] h-[25.079px] left-[0.001px] overflow-clip rounded-[12.5395px] top-0 w-[85.985px]"
      data-name="Frame"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#0d6efd] text-[10.7481px] text-left text-nowrap"
        style={{ top: "calc(50% - 8.95647px)", left: "calc(50% - 35.8252px)" }}
      >
        <p className="block leading-[17.9136px] whitespace-pre">
          Não analisado
        </p>
      </div>
    </div>
  );
}

function Tag4() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-[25.079px] left-[10.749px] translate-y-[-50%] w-[85.985px]"
      data-name="Tag"
      style={{ top: "calc(50% - 0.00141144px)" }}
    >
      <Frame38 />
    </div>
  );
}

function Frame39() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[0.001%] left-[74.357%] right-[14.607%] top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Tag4 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button12() {
  return (
    <div
      className="absolute bg-[#0d6efd] h-[32.244px] overflow-clip rounded-[5.37407px] translate-x-[-50%] translate-y-[-50%] w-[79.715px]"
      data-name="Button"
      style={{
        top: "calc(50% - 0.00109959px)",
        left: "calc(50% + 0.000602722px)",
      }}
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#ffffff] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.8525px)", left: "calc(50% - 29.1111px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">ANALISAR</p>
      </div>
    </div>
  );
}

function Frame40() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[0.001%] left-[85.393%] right-0 top-[-0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Button12 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Row4() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] bottom-[33.333%] left-0 right-0 top-[55.556%]"
      data-name="Row"
    >
      <Frame34 />
      <Frame35 />
      <Frame36 />
      <Frame37 />
      <Frame39 />
      <Frame40 />
    </div>
  );
}

function Delete5() {
  return (
    <div
      className="absolute size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="delete"
      style={{
        top: "calc(50% - 0.000546455px)",
        left: "calc(50% - 0.00154209px)",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="delete">
          <path
            d={svgPaths.p2ca18a00}
            fill="var(--fill-0, #0D6EFD)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame41() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[-0.001%] left-0 right-[94.407%] top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Delete5 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame42() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[-0.001%] left-[5.593%] right-[76.02%] top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[10.749px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[194.586px]"
          style={{ top: "calc(50% - 9.85301px)" }}
        >
          <p className="block leading-[19.7049px]">596 9 35781/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame43() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[-0.001%] left-[59.146%] right-[25.642%] top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#379ae6] text-[12.5395px] text-left w-[158.759px]"
          style={{ top: "calc(50% - 9.85301px)" }}
        >
          <p className="block leading-[19.7049px]">09/03/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame44() {
  return (
    <div
      className="absolute bg-[#edfef2] h-[25.079px] left-[0.001px] overflow-clip rounded-[12.5395px] top-0 w-[63.593px]"
      data-name="Frame"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#0eaa42] text-[10.7481px] text-left text-nowrap"
        style={{ top: "calc(50% - 8.9566px)", left: "calc(50% - 24.6293px)" }}
      >
        <p className="block leading-[17.9136px] whitespace-pre">Analisado</p>
      </div>
    </div>
  );
}

function Tag5() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-[25.079px] left-[10.749px] translate-y-[-50%] w-[63.593px]"
      data-name="Tag"
      style={{ top: "calc(50% - 0.000559807px)" }}
    >
      <Frame44 />
    </div>
  );
}

function Frame45() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[-0.001%] left-[74.357%] right-[14.607%] top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Tag5 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame46() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[-0.001%] left-[23.98%] right-[40.854%] top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#171a1f] text-[12.5395px] text-left w-[393.427px]"
          style={{ top: "calc(50% - 9.85301px)" }}
        >
          <p className="block leading-[19.7049px] whitespace-pre-wrap">{`DOCNAME  22014155454`}</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button13() {
  return (
    <div
      className="absolute bg-[#0eaa42] h-[32.244px] overflow-clip rounded-[5.37407px] translate-x-[-50%] translate-y-[-50%] w-[94.046px]"
      data-name="Button"
      style={{
        top: "calc(50% - 0.000247955px)",
        left: "calc(50% - 0.000701904px)",
      }}
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#ffffff] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.85263px)", left: "calc(50% - 36.2753px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">CONSULTAR</p>
      </div>
    </div>
  );
}

function Frame47() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-[-0.001%] left-[85.393%] right-0 top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Button13 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Row5() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] bottom-[22.222%] left-0 right-0 top-[66.667%]"
      data-name="Row"
    >
      <Frame41 />
      <Frame42 />
      <Frame43 />
      <Frame45 />
      <Frame46 />
      <Frame47 />
    </div>
  );
}

function Frame48() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[-0.001%] left-[59.146%] right-[25.642%] top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#379ae6] text-[12.5395px] text-left w-[158.759px]"
          style={{ top: "calc(50% - 9.85217px)" }}
        >
          <p className="block leading-[19.7049px]">09/03/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame49() {
  return (
    <div
      className="absolute bg-[#f0f6ff] h-[25.079px] left-[0.001px] overflow-clip rounded-[12.5395px] top-0 w-[85.985px]"
      data-name="Frame"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#0d6efd] text-[10.7481px] text-left text-nowrap"
        style={{ top: "calc(50% - 8.95672px)", left: "calc(50% - 35.8252px)" }}
      >
        <p className="block leading-[17.9136px] whitespace-pre">
          Não analisado
        </p>
      </div>
    </div>
  );
}

function Tag6() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-[25.079px] left-[10.749px] translate-y-[-50%] w-[85.985px]"
      data-name="Tag"
      style={{ top: "calc(50% + 0.000281334px)" }}
    >
      <Frame49 />
    </div>
  );
}

function Frame50() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[-0.001%] left-[74.357%] right-[14.607%] top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Tag6 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button14() {
  return (
    <div
      className="absolute bg-[#0d6efd] h-[32.244px] overflow-clip rounded-[5.37407px] translate-x-[-50%] translate-y-[-50%] w-[79.715px]"
      data-name="Button"
      style={{
        top: "calc(50% - 0.000373363px)",
        left: "calc(50% + 0.000602722px)",
      }}
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#ffffff] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.85178px)", left: "calc(50% - 29.1111px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">ANALISAR</p>
      </div>
    </div>
  );
}

function Frame51() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[-0.001%] left-[85.393%] right-0 top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Button14 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame52() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[-0.001%] left-[5.593%] right-[76.02%] top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[10.749px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[194.586px]"
          style={{ top: "calc(50% - 9.85217px)" }}
        >
          <p className="block leading-[19.7049px]">596 9 35782/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Delete6() {
  return (
    <div
      className="absolute size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="delete"
      style={{
        top: "calc(50% + 0.000294685px)",
        left: "calc(50% - 0.00154209px)",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="delete">
          <path
            d={svgPaths.p33dc8600}
            fill="var(--fill-0, #0D6EFD)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame53() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[-0.001%] left-0 right-[94.407%] top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Delete6 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame54() {
  return (
    <div
      className="absolute bg-[#ffffff] bottom-[-0.001%] left-[23.98%] right-[40.854%] top-[0.001%]"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#171a1f] text-[12.5395px] text-left w-[393.427px]"
          style={{ top: "calc(50% - 9.85217px)" }}
        >
          <p className="block leading-[19.7049px] whitespace-pre-wrap">{`DOCNAME  22014155454`}</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Row6() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] bottom-[11.111%] left-0 right-0 top-[77.778%]"
      data-name="Row"
    >
      <Frame48 />
      <Frame50 />
      <Frame51 />
      <Frame52 />
      <Frame53 />
      <Frame54 />
    </div>
  );
}

function Frame55() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-[5.593%] right-[76.02%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[10.749px] not-italic text-[#565d6d] text-[12.5395px] text-left w-[194.586px]"
          style={{ top: "calc(50% - 9.8523px)" }}
        >
          <p className="block leading-[19.7049px]">596 9 35782/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame56() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-[59.146%] right-[25.642%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#379ae6] text-[12.5395px] text-left w-[158.759px]"
          style={{ top: "calc(50% - 9.8523px)" }}
        >
          <p className="block leading-[19.7049px]">09/03/2023</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Delete7() {
  return (
    <div
      className="absolute size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="delete"
      style={{
        top: "calc(50% + 0.000170708px)",
        left: "calc(50% - 0.00154209px)",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="delete">
          <path
            d={svgPaths.p2bd99b80}
            fill="var(--fill-0, #0D6EFD)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Frame57() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-0 right-[94.407%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Delete7 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame58() {
  return (
    <div
      className="absolute bg-[#f0f6ff] h-[25.079px] left-[0.001px] overflow-clip rounded-[12.5395px] top-0 w-[85.985px]"
      data-name="Frame"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#0d6efd] text-[10.7481px] text-left text-nowrap"
        style={{ top: "calc(50% - 8.95588px)", left: "calc(50% - 35.8252px)" }}
      >
        <p className="block leading-[17.9136px] whitespace-pre">
          Não analisado
        </p>
      </div>
    </div>
  );
}

function Tag7() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-[25.079px] left-[10.749px] translate-y-[-50%] w-[85.985px]"
      data-name="Tag"
      style={{ top: "calc(50% + 0.000156403px)" }}
    >
      <Frame58 />
    </div>
  );
}

function Frame59() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-[74.357%] right-[14.607%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Tag7 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Frame60() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-[23.98%] right-[40.854%] top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.747px] not-italic text-[#171a1f] text-[12.5395px] text-left w-[393.427px]"
          style={{ top: "calc(50% - 9.8523px)" }}
        >
          <p className="block leading-[19.7049px] whitespace-pre-wrap">{`DOCNAME  22014155454`}</p>
        </div>
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Button15() {
  return (
    <div
      className="absolute bg-[#0d6efd] h-[32.244px] overflow-clip rounded-[5.37407px] translate-x-[-50%] translate-y-[-50%] w-[79.715px]"
      data-name="Button"
      style={{
        top: "calc(50% - 0.000498295px)",
        left: "calc(50% + 0.000602722px)",
      }}
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#ffffff] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.85191px)", left: "calc(50% - 29.1111px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">ANALISAR</p>
      </div>
    </div>
  );
}

function Frame61() {
  return (
    <div
      className="absolute bg-[#fafafb] bottom-0 left-[85.393%] right-0 top-0"
      data-name="Frame"
    >
      <div className="overflow-clip relative size-full">
        <Button15 />
      </div>
      <div className="absolute border-0 border-[#bdc1ca] border-solid inset-0 pointer-events-none" />
    </div>
  );
}

function Row7() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] bottom-0 left-0 right-0 top-[88.889%]"
      data-name="Row"
    >
      <Frame55 />
      <Frame56 />
      <Frame57 />
      <Frame59 />
      <Frame60 />
      <Frame61 />
    </div>
  );
}

function Table27() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] h-[419.177px] left-[21px] rounded-[5.37407px] top-[270.769px] w-[1184.98px]"
      data-name="Table 27"
    >
      <div className="h-[419.177px] overflow-clip relative w-[1184.98px]">
        <Header />
        <Row />
        <Row1 />
        <Row2 />
        <Row3 />
        <Row4 />
        <Row5 />
        <Row6 />
        <Row7 />
      </div>
      <div className="absolute border-[#bdc1ca] border-[0.895678px] border-solid inset-[-0.448px] pointer-events-none rounded-[5.82191px]" />
    </div>
  );
}

function ChevronLeftLarge() {
  return (
    <div
      className="absolute left-1/2 size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="Chevron left large"
      style={{ top: "calc(50% - 0.000573158px)" }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="Chevron left large">
          <path
            d={svgPaths.p30391f80}
            fill="var(--fill-0, #424856)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Button1() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] left-[1009.83px] overflow-clip rounded-[5.37407px] size-[32.244px] top-[708.755px]"
      data-name="Button 1"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#424856] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.85304px)", left: "calc(50% + 7.16619px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">&nbsp;</p>
      </div>
      <ChevronLeftLarge />
    </div>
  );
}

function Button2() {
  return (
    <div
      className="absolute bg-[#ffffff] h-[32.244px] left-[1077px] rounded-[5.37407px] top-[708.755px] w-[28.662px]"
      data-name="Button 2"
    >
      <div className="h-[32.244px] overflow-clip relative w-[28.662px]">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#9095a1] text-[12.5395px] text-left text-nowrap"
          style={{
            top: "calc(50% - 9.85304px)",
            left: "calc(50% - 3.58204px)",
          }}
        >
          <p className="block leading-[19.7049px] whitespace-pre">2</p>
        </div>
      </div>
      <div className="absolute border-[#dee1e6] border-[0.895678px] border-solid inset-0 pointer-events-none rounded-[5.37407px]" />
    </div>
  );
}

function Button3() {
  return (
    <div
      className="absolute bg-[#ffffff] h-[32.244px] left-[1109.25px] rounded-[5.37407px] top-[708.755px] w-[29.557px]"
      data-name="Button 3"
    >
      <div className="h-[32.244px] overflow-clip relative w-[29.557px]">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#9095a1] text-[12.5395px] text-left text-nowrap"
          style={{ top: "calc(50% - 9.85304px)", left: "calc(50% - 3.5828px)" }}
        >
          <p className="block leading-[19.7049px] whitespace-pre">3</p>
        </div>
      </div>
      <div className="absolute border-[#dee1e6] border-[0.895678px] border-solid inset-0 pointer-events-none rounded-[5.37407px]" />
    </div>
  );
}

function Menu5() {
  return (
    <div
      className="absolute size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="Menu 5"
      style={{
        top: "calc(50% - 0.000573158px)",
        left: "calc(50% - 0.00184631px)",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="Menu 5">
          <path
            d={svgPaths.p13314700}
            id="Vector"
            stroke="var(--stroke-0, #9095A1)"
            strokeLinecap="square"
            strokeMiterlimit="10"
            strokeWidth="1.22836"
          />
          <path
            d={svgPaths.p20606900}
            id="Vector_2"
            stroke="var(--stroke-0, #9095A1)"
            strokeLinecap="square"
            strokeMiterlimit="10"
            strokeWidth="1.22836"
          />
          <path
            d={svgPaths.p17045800}
            id="Vector_3"
            stroke="var(--stroke-0, #9095A1)"
            strokeLinecap="square"
            strokeMiterlimit="10"
            strokeWidth="1.22836"
          />
        </g>
      </svg>
    </div>
  );
}

function Button5() {
  return (
    <div
      className="absolute bg-[#ffffff] left-[1141.49px] rounded-[5.37407px] size-[32.244px] top-[708.755px]"
      data-name="Button 5"
    >
      <div className="overflow-clip relative size-[32.244px]">
        <div
          className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#9095a1] text-[12.5395px] text-left text-nowrap"
          style={{
            top: "calc(50% - 9.85304px)",
            left: "calc(50% + 7.16426px)",
          }}
        >
          <p className="block leading-[19.7049px] whitespace-pre">&nbsp;</p>
        </div>
        <Menu5 />
      </div>
      <div className="absolute border-[#dee1e6] border-[0.895678px] border-solid inset-0 pointer-events-none rounded-[5.37407px]" />
    </div>
  );
}

function ChevronRightLarge() {
  return (
    <div
      className="absolute size-[14.331px] translate-x-[-50%] translate-y-[-50%]"
      data-name="Chevron right large"
      style={{
        top: "calc(50% - 0.000573158px)",
        left: "calc(50% + 0.000468254px)",
      }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 15 15"
      >
        <g id="Chevron right large">
          <path
            d={svgPaths.p23c1d400}
            fill="var(--fill-0, #424856)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function Button8() {
  return (
    <div
      className="absolute bg-[rgba(0,0,0,0)] left-[1173.74px] overflow-clip rounded-[5.37407px] size-[32.244px] top-[708.755px]"
      data-name="Button 8"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#424856] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.85304px)", left: "calc(50% + 7.16658px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">&nbsp;</p>
      </div>
      <ChevronRightLarge />
    </div>
  );
}

function Button9() {
  return (
    <div
      className="absolute bg-[#0d6efd] h-[32.244px] left-[1045.65px] overflow-clip rounded-[5.37407px] top-[708.755px] w-[28.662px]"
      data-name="Button 9"
    >
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] not-italic text-[#ffffff] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.85304px)", left: "calc(50% - 3.58352px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">1</p>
      </div>
    </div>
  );
}

function Group2() {
  return (
    <div className="absolute contents left-[1009.83px] top-[708.755px]">
      <Button1 />
      <Button2 />
      <Button3 />
      <Button5 />
      <Button8 />
      <Button9 />
    </div>
  );
}

function ChevronDownLarge() {
  return (
    <div
      className="absolute right-[9.852px] size-[12.54px] translate-y-[-50%]"
      data-name="Chevron down large"
      style={{ top: "calc(50% + 0.448072px)" }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 13 13"
      >
        <g id="Chevron down large">
          <path
            d={svgPaths.p386ae740}
            fill="var(--fill-0, #171A1F)"
            id="Vector"
          />
        </g>
      </svg>
    </div>
  );
}

function DropdownButton11() {
  return (
    <div
      className="absolute bg-[#ffffff] h-[31.349px] left-[24.581px] rounded-[5.37407px] top-[707.859px] w-[116.438px]"
      data-name="Dropdown Button 11"
    >
      <div className="absolute border-[#bdc1ca] border-[0.895678px] border-solid inset-[-0.896px] pointer-events-none rounded-[6.26975px]" />
      <div
        className="absolute font-['Open_Sans:Regular',_sans-serif] leading-[0] left-[10.749px] not-italic right-[40.689px] text-[#171a1f] text-[12.5395px] text-left text-nowrap"
        style={{ top: "calc(50% - 9.40408px)" }}
      >
        <p className="block leading-[19.7049px] whitespace-pre">Mostrar 10</p>
      </div>
      <ChevronDownLarge />
    </div>
  );
}

function Svg3() {
  return (
    <div
      className="absolute left-1/2 size-3.5 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="SVG"
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g id="SVG">
          <path
            d={svgPaths.p29efa600}
            id="Vector"
            stroke="var(--stroke-0, #323338)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
          <path
            d={svgPaths.p3042bc80}
            id="Vector_2"
            stroke="var(--stroke-0, #323338)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Background1() {
  return (
    <div
      className="absolute bg-[#d83a52] overflow-clip right-[-3.5px] rounded-[5px] size-[17.5px] top-[-3.5px]"
      data-name="Background"
    >
      <div
        className="absolute flex flex-col font-['Tahoma:Regular',_sans-serif] h-[13px] justify-center leading-[0] not-italic text-[#ffffff] text-[10.5px] text-center translate-x-[-50%] translate-y-[-50%] w-[5.93px]"
        style={{ top: "calc(50% - 0.5px)", left: "calc(50% + 0.095px)" }}
      >
        <p className="block leading-[14px]">3</p>
      </div>
    </div>
  );
}

function Button16() {
  return (
    <div
      className="absolute h-7 left-[1019.09px] rounded-[5px] translate-y-[-50%] w-[31.5px]"
      data-name="Button"
      style={{ top: "calc(50% - 0.5px)" }}
    >
      <Svg3 />
      <Background1 />
    </div>
  );
}

function Svg4() {
  return (
    <div
      className="absolute size-3.5 top-1/2 translate-x-[-50%] translate-y-[-50%]"
      data-name="SVG"
      style={{ left: "calc(50% + 47.705px)" }}
    >
      <svg
        className="block size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox="0 0 14 14"
      >
        <g id="SVG">
          <path
            d="M3.5 5.25L7 8.75L10.5 5.25"
            id="Vector"
            stroke="var(--stroke-0, #676879)"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.16667"
          />
        </g>
      </svg>
    </div>
  );
}

function Background2() {
  return (
    <div
      className="absolute bg-[#0073ea] bottom-[1.75px] left-[10.5px] overflow-clip right-[91.91px] rounded-[3.35544e+07px] top-[1.75px]"
      data-name="Background"
    >
      <div
        className="absolute flex flex-col font-['Tahoma:Regular',_sans-serif] h-[15px] justify-center leading-[0] not-italic text-[#ffffff] text-[12.3px] text-center translate-x-[-50%] translate-y-[-50%] w-[12.14px]"
        style={{ top: "calc(50% - 0.25px)", left: "calc(50% + 0.11px)" }}
      >
        <p className="block leading-[17.5px]">JS</p>
      </div>
    </div>
  );
}

function ButtonMenu() {
  return (
    <div
      className="absolute h-[31.5px] left-[1064.59px] rounded-[5px] translate-y-[-50%] w-[130.41px]"
      data-name="Button menu"
      style={{ top: "calc(50% - 0.5px)" }}
    >
      <div
        className="absolute flex flex-col font-['Tahoma:Regular',_sans-serif] h-[17.5px] justify-center leading-[0] not-italic text-[#323338] text-[12.1078px] text-center top-[15.75px] translate-x-[-50%] translate-y-[-50%] w-[53.61px]"
        style={{ left: "calc(50% + 7.1px)" }}
      >
        <p className="block leading-[17.5px]">João Silva</p>
      </div>
      <Svg4 />
      <Background2 />
    </div>
  );
}

function Header1() {
  return (
    <div
      className="absolute bg-[#ffffff] h-14 left-0 right-0 top-0"
      data-name="Header"
    >
      <div className="absolute border-[#d0d4d9] border-[0px_0px_1px] border-solid inset-0 pointer-events-none" />
      <div
        className="absolute h-[0.01px] left-[21px] right-[196.91px] translate-y-[-50%]"
        data-name="Rectangle"
        style={{ top: "calc(50% - 0.495px)" }}
      />
      <Button16 />
      <ButtonMenu />
    </div>
  );
}

function Container3() {
  return (
    <div
      className="absolute bottom-0 left-56 overflow-clip right-0 top-0"
      data-name="Container"
    >
      <Main />
      <Container16 />
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[24.581px] not-italic text-[#0d6efd] text-[14.3309px] text-left text-nowrap top-[140px]">
        <p className="block leading-[23.2876px] whitespace-pre">
          Documentos / Listagem
        </p>
      </div>
      <div className="absolute font-['Inter:Regular',_sans-serif] font-normal leading-[0] left-[24.581px] not-italic text-[#171a1f] text-[12.5395px] text-left text-nowrap top-[183.888px]">
        <p className="block leading-[21.4963px] whitespace-pre">
          Buscar documento
        </p>
      </div>
      <Table27 />
      <Group2 />
      <DropdownButton11 />
      <Header1 />
    </div>
  );
}

export default function Component1440WLight() {
  return (
    <div
      className="bg-[#ffffff] relative size-full"
      data-name="1440w light"
      style={{
        backgroundImage:
          "linear-gradient(90deg, rgb(248, 249, 251) 0%, rgb(248, 249, 251) 100%), linear-gradient(90deg, rgb(248, 249, 251) 0%, rgb(248, 249, 251) 100%)",
      }}
    >
      <Aside />
      <Container3 />
      <div
        className="absolute bottom-[96.37%] left-[83.75%] right-[15.44%] top-[2.333%]"
        data-name="Vector"
      >
        <svg
          className="block size-full"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 12 12"
        >
          <path
            d={svgPaths.p331aae70}
            fill="var(--fill-0, #282F3B)"
            id="Vector"
          />
        </svg>
      </div>
    </div>
  );
}