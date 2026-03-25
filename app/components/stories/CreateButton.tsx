export default function CreateButton({title, onClick }: {title: string, onClick: () => void}) {
    return (
        <button onClick={onClick} className="bg-[#B9FF68] p-2 rounded-[10px] text-[#3C3434] cursor-pointer ">{title}</button>
    )
}