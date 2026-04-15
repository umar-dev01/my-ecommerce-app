// components/Container.jsx
function Container({ children, className = "" }) {
  return (
    <div
      className={`
      mx-auto w-full
      px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
      max-w-[1440px] 2xl:max-w-[1600px]
      ${className}
    `}
    >
      {children}
    </div>
  );
}

export default Container;
