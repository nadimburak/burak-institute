import AddressField from "@/components/address/address"
import ContactForm from "@/components/form/contactForm"
import Image from "next/image"
import { Box} from "@mui/material"

const page = () => {
  return (
    <Box sx={{
      display:"flex",
      gap:7
    }}>
      <Box>
      <AddressField/>
      <ContactForm/>
      </Box>

      <Box sx={{
        // border: '2px solid #7C3AED',
         borderRadius:'20px',
         marginTop:'70px',
         "&:hover": {
                        // border: '2px solid #7C3AED',
                        border:'none',
                        boxShadow: '2px 2px 30px 4px #7C3AED',
                         transition: "box-shadow 0.3s ease",
                    },
                    width:'600px',
        height:'800px',
        // overflow:'hidden'
      }}>
    <Image
        src="/1.png"
        alt="Example"
        width={600}
        height={800}
        style={{ objectFit: "cover",
          // border:'2px solid red',
          borderRadius:'20px',
          
        }} // image fit kare box ke andar
        />
        </Box>
      
   </Box>
  )
}

export default page
