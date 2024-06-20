import SignUpCard from "../components/SignUpCard"
import LoginCard from "../components/LoginCard"
import { useRecoilValue} from "recoil"
import authScreenAtom from "../atoms/authAtom"
const AuthPage = () => {
  const authScreenState = useRecoilValue(authScreenAtom)
  // useSetRecoilState(authScreenState);
  // const [value, setValue] = useState("login")
  console.log(authScreenState)
  return (
    <>
      {authScreenState=="login"? <LoginCard/>: <SignUpCard/>}
    </>
  )
}

export default AuthPage
