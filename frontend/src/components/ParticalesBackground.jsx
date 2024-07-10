import Particles from 'react-tsparticles'
import particalesConfig from "../config/paritcale-config"
const ParticalesBackground = () => {
  return (
    <div>
      <Particles id="tsparticles" params={particalesConfig} ></Particles>
    </div>
  )
}

export default ParticalesBackground
