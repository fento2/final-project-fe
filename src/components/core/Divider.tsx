interface DividerProps {
    name: string
}

export default function Divider({ name }: DividerProps) {
    return (
        <div className="flex items-center w-full my-2">
            <div className="flex-grow border-t border-solid border-gray-200"></div>
            <span className="mx-2 text-xs text-gray-400">{name}</span>
            <div className="flex-grow border-t border-solid border-gray-200"></div>
        </div>
    )
}