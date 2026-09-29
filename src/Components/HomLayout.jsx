import axios from 'axios'
import { Download, Loader } from 'lucide-react'
import React, { useRef } from 'react'

function HomLayout() {
    const resolutionref=useRef(null)
    const [formatvalue,setformatvalue]=React.useState("mp4")
    const [linkvalue,setlinkvalue]=React.useState("")
    const [loading,setloading]=React.useState(false)

    const validateYouTubeUrl = (url) => {
        const regex = /^(https?\:\/\/)?(www\.youtube\.com|youtu\.?be)\/.+$/;
        return regex.test(url);
      }
   
const handleSubmit=async()=>{
    const title=linkvalue.substring(8)
    console.log("Title:", title);
    try{
    if (validateYouTubeUrl(linkvalue)) {
        console.log("Valid YouTube URL");
    let senddata={}
    if(formatvalue==="mp4"){
        senddata={
            link:linkvalue,
            format:formatvalue,
            resolution:resolutionref.current.value
        }
    }
    else{
        senddata={
            link:linkvalue,
            format:formatvalue
        }
    }
        const downloadurl=await axios.post("https://tubedown-django.onrender.com/api/download/",senddata)
    console.log("Download URL:", downloadurl.data);
    const taskId = downloadurl?.data.task_id;
    console.log("Task ID:", taskId);
    setloading(true)
     let completed = false;

    while (!completed) {
      const statusResponse = await axios.get(
        `https://tubedown-django.onrender.com/api/download/status/${taskId}/`
      );

      const status = statusResponse.data.status;

      console.log("Status:", status);

      if (status === "completed") {
        completed = true;
      }

      if (status === "failed") {
        throw new Error("Download failed");
      }

      if (!completed) {
        await new Promise((resolve) =>
          setTimeout(resolve, 2000)
        );
      }
    }

    // 3. Get actual file
    const fileResponse = await axios.get(
      `https://tubedown-django.onrender.com/api/download/file/${taskId}/`,
      {
        responseType: "blob",
      }
    );

    // 4. Download in browser
    const downloadUrl = window.URL.createObjectURL(
      fileResponse.data
    );

    const link = document.createElement("a");

    link.href = downloadUrl;
    link.download = `video_${title}.mp4`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(downloadUrl);

  } 

}
catch(e){
    console.error("download failed")
}
finally{
    setloading(false)
    setlinkvalue("")
}

}
  return (
    <div className='bg-[#160106] w-full text-white flex flex-col min-h-screen'>
      <div className='flex flex-col items-center justify-center gap-4 lg:gap-8 mt-16 lg:mt-32'>
        <div className='flex flex-col items-center justify-center gap-2 lg:gap-4'>
        <h1 className='text-xl lg:text-5xl font-bold text-[#f5c0cd] tracking-wider font-serif'>Download High Quality Youtube</h1>
        <h1 className='text-xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#f5c0cd] to-[#c23558] tracking-wider font-serif'>Videos & Audiophile Sound </h1>
        </div>
        <p className='text-sm lg:text-lg text-center text-gray-400 px-4 lg:px-16'>TubeDown is a simple and easy to use YouTube video downloader. Just paste the YouTube video link and click on the download button to download the video.</p>

      </div>

    <div children className='flex w-full flex-col items-center justify-center gap-6 lg:gap-8 mt-16 lg:mt-32' >
        <div className='flex  items-center justify-center gap-2 lg:gap-4 w-full'>
            <input value={linkvalue} onChange={(e) => setlinkvalue(e.target.value)} type="text" placeholder='Paste the YouTube video link here' className='bg-[#0f0f0f] text-sm md:text-base text-white border border-gray-600 rounded-2xl p-2 lg:p-4 w-65 lg:w-[50%] focus:outline-none focus:ring-2 focus:ring-[#d26582] focus:border-transparent' />
            <div className='bg-[#0f0f0f] rounded-md border w-15 lg:w-[5%] border-gray-600 p-2 focus:ring-2  focus:ring-[#d26582]'>
            <select value={formatvalue} onChange={(e) => setformatvalue(e.target.value)} className=' text-gray-400  text-sm md:text-base outline-0  p-0 lg:p-3 focus:outline-none f focus:border-transparent'>
                <option value="mp4">MP4</option>
                <option value="mp3">MP3</option>
            </select>
            </div>
    {
        formatvalue==="mp4" && 
    
     <div className='bg-[#0f0f0f] rounded-md border w-20 lg:w-[6%] border-gray-600 py-2 p-1 lg:p-2 focus:ring-2  focus:ring-[#d26582]'>
   <select ref={resolutionref} className=' text-gray-400 text-sm md:text-base  border-gray-600  p-0  lg:p-3 focus:outline-none focus:border-transparent'>
                <option value="720">720p</option>
                <option value="1080">1080p</option>
                <option value="1440">1440p</option>
                <option value="2160">2160p</option>
            </select>

            </div>
}

        </div>
        <div>
            <div onClick={handleSubmit} className='bg-[#d26582] justify-center items-center flex text-white rounded-lg p-2 lg:p-4 w-22 lg:w-48 hover:bg-[#c23558] transition duration-300'> {loading ? <Loader className="animate-spin" /> : <Download/>}   </div>
        </div>

    </div>



    </div>

  )
}

export default HomLayout