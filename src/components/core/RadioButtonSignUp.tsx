

interface IDataSignUp {
    role: string,
    name: string,
    username: string,
    email: string,
    password: string,
    confirmPassword: string,
}
interface RadioButtonSignUpProps {
    dataSignUp: IDataSignUp
    setDataSignUp: (data: IDataSignUp) => void
}


const RadioButtonSignUp = ({ dataSignUp, setDataSignUp }: RadioButtonSignUpProps) => {
    return (
        <>
            <div className="flex items-center gap-4 mb-2">
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="radio"
                        name="role"
                        value="USER"
                        checked={dataSignUp.role === "USER"}
                        onChange={() => setDataSignUp({ ...dataSignUp, role: 'USER' })}
                    />
                    User
                </label>
                <label className="flex items-center gap-2 text-sm">
                    <input
                        type="radio"
                        name="role"
                        value="COMPANY"
                        checked={dataSignUp.role === "COMPANY"}
                        onChange={() => setDataSignUp({ ...dataSignUp, role: 'COMPANY' })}
                    />
                    Company
                </label>
            </div>
        </>
    )
}
export default RadioButtonSignUp