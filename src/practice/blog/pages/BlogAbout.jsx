function BlogAbout() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-4xl font-bold text-purple-800 mb-6">About Me 👨‍💻</h1>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-purple-800 rounded-full flex items-center justify-center text-white text-3xl">
            U
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Umar</h2>
            <p className="text-pink-600 font-medium">Full Stack Developer</p>
          </div>
        </div>

        <p className="text-gray-600 leading-relaxed mb-4">
          I am a full-stack web engineer based in Pakistan. I build scalable web
          applications using React, Node.js, and MongoDB.
        </p>

        <p className="text-gray-600 leading-relaxed mb-6">
          I am passionate about clean code, great user experiences, and
          continuously improving my skills every single day.
        </p>

        <div className="flex gap-4">
          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded font-medium">
            React
          </span>
          <span className="bg-pink-100 text-pink-800 px-3 py-1 rounded font-medium">
            Node.js
          </span>
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded font-medium">
            MongoDB
          </span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded font-medium">
            Tailwind
          </span>
        </div>
      </div>
    </div>
  );
}

export default BlogAbout;
