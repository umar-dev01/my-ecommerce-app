// components/Container.jsx
function Container({ children, className = "" }) {
  return (
    <div
      className={`
      container mx-auto
      px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16
      max-w-7xl
      ${className}
    `}
    >
      {children}
    </div>
  );
}

export default Container;
