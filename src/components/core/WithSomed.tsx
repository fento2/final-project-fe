const WithSosmed = () => {
  return (
    <>
      <div className="flex gap-3 w-full justify-center mt-2">
        <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-6 h-6"
          />
        </button>
        <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
          <img
            src="https://www.svgrepo.com/show/448224/facebook.svg"
            alt="Facebook"
            className="w-6 h-6"
          />
        </button>
        <button className="flex items-center justify-center w-12 h-12 rounded-xl border bg-white hover:bg-gray-100 transition grow">
          <img
            src="https://cdn.simpleicons.org/onlyfans/00AFF0"
            alt="OnlyFans"
            className="w-6 h-6"
          />
        </button>
      </div>
    </>
  );
};

export default WithSosmed;
