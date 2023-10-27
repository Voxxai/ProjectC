import React from 'react';

function NewsArticle({ title, description }) {
  return (
    <div className="gap-3 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
      <div className="flex flex-col items-stretch w-[60%] max-md:w-full max-md:ml-0">
        <div className="flex grow flex-col max-md:mt-10">
          <div className="bg-zinc-300 flex w-[400px] h-[182px] flex-col self-start" />
          <div className="justify-center text-fuchsia-800 text-3xl font-semibold mt-4 self-start">
            {title}
          </div>
          <div className="text-zinc-500 text-base mt-4">
            {description}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewsArticle;
