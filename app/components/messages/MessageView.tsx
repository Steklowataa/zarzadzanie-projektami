export default function MessageView({counter, visibility}: {counter: number, visibility: boolean}) {
    if (!visibility) return null;

    return (
        <div className="relative rounded-full bg-[#B1FF58] justify-center items-center flex 
            w-[24px] h-[24px] text-black">
            {counter}
        </div>
    );
}