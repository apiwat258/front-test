'use client';
export const dynamic = 'force-dynamic'; // ✅ ใช้ Client Component
import Link from "next/link";
import { QrButton } from "@/components/qr-button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const page = async () => {
  const onScan = (data: string) => {
    console.log("Scanned data:", data);
  };

  return (
    <div className="flex flex-col w-full h-full">

      {/* Home Section */}
      <section className="flex flex-col justify-center items-center w-full h-full min-h-screen bg-[url('/images/CowBg.jpg')] bg-cover bg-center bg-[#3D405B] bg-blend-overlay bg-opacity-80" id="home">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute top-0 z-10">
          <path fill="#3D405B" d="M0,224L34.3,192C68.6,160,137,96,206,90.7C274.3,85,343,139,411,144C480,149,549,107,617,122.7C685.7,139,754,213,823,240C891.4,267,960,245,1029,224C1097.1,203,1166,181,1234,160C1302.9,139,1371,117,1406,106.7L1440,96L1440,0L1405.7,0C1371.4,0,1303,0,1234,0C1165.7,0,1097,0,1029,0C960,0,891,0,823,0C754.3,0,686,0,617,0C548.6,0,480,0,411,0C342.9,0,274,0,206,0C137.1,0,69,0,34,0L0,0Z"></path>
        </svg>

        {/* Welcome text */}
        <div className="flex flex-col md:flex-row w-full min-h-screen" id="home">
          <div className="w-full md:w-1/2 flex flex-col justify-center items-start p-10 text-white md:pl-20">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-bold">Welcome to our Final Project</h1>
              <h1 className="text-5xl font-bold">Purely Trace is</h1>
              <span className="text-5xl font-bold">Organic <p className="inline text-5xl font-bold text-[#ffc260]">Blockchain</p></span>
            </div>
            <a href="#" className="text-xl mt-8 bg-[#f2cc8f] p-2 px-3 rounded-full font-semibold">Our Story</a>
            <div className="flex flex-wrap align-middle items-center gap-3 mt-5">
              <input type="search" className="w-full md:w-96 rounded-full h-13 p-3 items-center" placeholder="Search..." />
              <button className="bg-blue-500 flex rounded-full w-12 h-12 text-center justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l5.6 5.6q.275.275.275.7t-.275.7t-.7.275t-.7-.275l-5.6-5.6q-.75.6-1.725.95T9.5 16m0-2q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14" />
                </svg>
              </button>
              {/* <a href="/" className="flex bg-gray-500 rounded-full w-12 h-12 text-center justify-center items-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M1 1h10v10H1zm2 2v6h6V3z" />
                  <path fill="currentColor" d="M5 5h2v2H5z" />
                  <path fill="currentColor" d="M13 1h10v10H13zm2 2v6h6V3z" />
                  <path fill="currentColor" d="M17 5h2v2h-2z" />
                  <path fill="currentColor" d="M1 13h10v10H1zm2 2v6h6v-6z" />
                  <path fill="currentColor" d="M5 17h2v2H5z" />
                  <path fill="currentColor" d="M23 19h-4v4h-6V13h1h-1v6h2v2h2v-6h-2v-2h-1h3v2h2v2h2v-4h2zm0 2v2h-2v-2z" />
                </svg>
              </a> */}
              <QrButton />
            </div>
          </div>
          {/* end Welcome text */}

          {/* Video Section */}
          <div className="flex flex-col w-full md:w-1/2 justify-center items-center z-40">
            <iframe src="https://www.youtube.com/embed/gUHn6o1og_0" className="w-full md:w-3/4 h-1/2 rounded-3xl"></iframe>
          </div>
        </div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute -bottom-20 z-10">
          <path fill="#ffffff" d="M0,224L34.3,192C68.6,160,137,96,206,90.7C274.3,85,343,139,411,144C480,149,549,107,617,122.7C685.7,139,754,213,823,240C891.4,267,960,245,1029,224C1097.1,203,1166,181,1234,160C1302.9,139,1371,117,1406,106.7L1440,96L1440,320L1405.7,320C1371.4,320,1303,320,1234,320C1165.7,320,1097,320,1029,320C960,320,891,320,823,320C754.3,320,686,320,617,320C548.6,320,480,320,411,320C342.9,320,274,320,206,320C137.1,320,69,320,34,320L0,320Z">
          </path>
        </svg>
      </section>
      {/* end home section */}

      {/* About section */}
      <section className="flex flex-col w-full h-full min-h-screen mt-28 items-center bg-white" id="about">
        <h1 className="text-5xl font-bold text-[#3D405B] mb-20">About Purely Trace</h1>
        <div className="flex flex-col md:flex-row w-full h-full">
          <div className="flex w-full md:w-1/2 h-full justify-center items-center">
            <img src="https://static.wixstatic.com/media/827c6d_f86a0bf6f6d84dc2bf0f49d03d3a3efe~mv2_d_2048_1367_s_2.jpg/v1/fill/w_2048,h_800,al_c,q_85,enc_avif,quality_auto/827c6d_f86a0bf6f6d84dc2bf0f49d03d3a3efe~mv2_d_2048_1367_s_2.jpg"
              alt="img" className="w-3/4 rounded-3xl" />
          </div>
          <div className="flex w-full md:w-1/2 h-full flex-col justify-center items-start pr-20">
            <h2 className="text-4xl mb-5 text-[#3D405B] font-semibold">Our Mission</h2>
            <p className="text-3xl text-gray-500"><b>Revolutionizing Organic Dairy Supply Chain Management</b>, Final Project is dedicated to revoultionizing the organic dairy supply chain management through innovative bloackchain technology. Our comprehensive application provides end to end solutions for dairy producers, distributors, and retailers, ensuring transparency and effieciency  throughout the supply chain. With a focus on sustainability and ethical practices, we aim to transform the dairy industry for the better.</p>
          </div>
        </div>
      </section>
      {/* end about section */}

      {/* Story section */}
      <div className="flex flex-col flex-wrap justify-between w-full min-h-screen items-center bg-[url('https://i.pinimg.com/736x/30/44/86/304486c10702352e3557a1a833a16967.jpg')] bg-no-repeat bg-cover" id="story">
        <svg viewBox="0 0 1265 144" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-full">
          <path fill="rgba(255, 255, 255, 1)" d="M 0 40 C 164 40 164 20 328 20 L 328 20 L 328 0 L 0 0 Z" strokeWidth="0"></path>
          <path fill="rgba(255, 255, 255, 1)" d="M 327 20 C 445.5 20 445.5 89 564 89 L 564 89 L 564 0 L 327 0 Z" strokeWidth="0"></path>
          <path fill="rgba(255, 255, 255, 1)" d="M 563 89 C 724.5 89 724.5 48 886 48 L 886 48 L 886 0 L 563 0 Z" strokeWidth="0"></path>
          <path fill="rgba(255, 255, 255, 1)" d="M 885 48 C 1006.5 48 1006.5 67 1128 67 L 1128 67 L 1128 0 L 885 0 Z" strokeWidth="0"></path>
          <path fill="rgba(255, 255, 255, 1)" d="M 1127 67 C 1196 67 1196 0 1265 0 L 1265 0 L 1265 0 L 1127 0 Z" strokeWidth="0"></path>
        </svg>
        <div className="flex w-full h-full justify-start items-center px-20">
          <div className="w-full md:w-1/3 h-3/4 flex flex-col rounded-3xl justify-center items-start bg-white bg-opacity-75 p-10 gap-8">
            <h1 className="text-5xl font-bold text-[#3D405B] text-start">Our Story</h1>
            <p className="text-2xl text-gray-600">Final Project was born out of a vision to empower dairy farmers and promote sustainable practices in the industry.
              Our team is deeply rooted in the dairy farming community, and we understand the challenges and opportunities faced by
              local producers. By leveraging cutting-edge technology, and a deep understanding of the dairy sector, we are committed to driving positive change
              and creating a more transparent, fair, and resilient dairy supply chain.
            </p>
          </div>
        </div>
        <svg viewBox="0 0 1265 144" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" className="w-full h-full scale-y-[-1]">
          <path fill="rgba(255, 255, 255, 1)" d="M 0 40 C 164 40 164 20 328 20 L 328 20 L 328 0 L 0 0 Z" strokeWidth="0"></path>
          <path fill="rgba(255, 255, 255, 1)" d="M 327 20 C 445.5 20 445.5 89 564 89 L 564 89 L 564 0 L 327 0 Z" strokeWidth="0"></path>
          <path fill="rgba(255, 255, 255, 1)" d="M 563 89 C 724.5 89 724.5 48 886 48 L 886 48 L 886 0 L 563 0 Z" strokeWidth="0"></path>
          <path fill="rgba(255, 255, 255, 1)" d="M 885 48 C 1006.5 48 1006.5 67 1128 67 L 1128 67 L 1128 0 L 885 0 Z" strokeWidth="0"></path>
          <path fill="rgba(255, 255, 255, 1)" d="M 1127 67 C 1196 67 1196 0 1265 0 L 1265 0 L 1265 0 L 1127 0 Z" strokeWidth="0"></path>
        </svg>
      </div>
      {/* end story section */}

      {/* Get to know supply chain section */}
      <div className="flex flex-col w-full h-full min-h-screen items-center bg-white px-10" id="details">
        <h1 className="text-5xl font-bold text-[#3d405B]">Get to Know Supply Chain Management</h1>
        <div className="flex w-full h-full justify-center items-center">
          <div className="flex flex-col w-full md:w-2/5 h-full justify-center mt-10 self-start p-8 gap-5">
            <h1 className="text-4xl text-start font-semibold">Organic Dairy</h1>
            <p className="pl-5 text-2xl text-gray-500"><b>Our comprehensive organic dairy supply chain management application with blockchain is</b> designed to revolutionize the way dairy products are sources, processed, and delivered.
              With a focus on substainability and transparency, our platform ensures that every step of the dairy supply chain is optimized for effieciency and quality.
              From farm to table, our innovative solution brings together farmers, processors, distributors, and retailers in seamless ecosystem.</p>
          </div>
          <div className="flex flex-col w-full md:w-2/5 h-full justify-center text-start text-white bg-[#3D405B] p-10 gap-5 self-start m-8 rounded-3xl">
            <h1 className="text-4xl text-start font-semibold">Blockchain Integration</h1>
            <p className="pl-5 text-2xl"><b>The integration of blockchain technology ensures the security and traceability of dairy products through the supply chain. </b>
              By leveraging bloackchain, we provide immutable records of every transaction and movement, offering unparalleled trust and accountability in the industry.
              This technology not only enhances food safety but also enables consumers to make informed choices about the dairy products they purchase.</p>
          </div>
        </div>
      </div>
      {/* end supply chain section */}

      {/* Meet the team section */}
      <div className="flex flex-col w-full h-full min-h-screen justify-center bg-[#f3f1de] p-10">
        <div className="flex flex-col w-full h-full justify-center items-center text-start gap-10">
          <div className="flex flex-col w-full h-full justify-center items-start">
            <h1 className="text-5xl text-[#3D405F] font-bold">Meet the Final Project Team</h1>
          </div>
          <div className="flex flex-col md:flex-row w-11/12 h-full gap-10 bg-white p-10 rounded-3xl">
            <div className="flex w-full md:w-1/3 h-full rounded-lg">
              <img src="/images/MeetTeamPic1.avif" alt="farm" className="rounded-3xl" />
            </div>
            <div className="flex flex-col w-full md:w-2/3 h-full justify-center items-start gap-5">
              <h1 className="text-4xl font-semibold text-[#3D405B]">Pioneers in Organic Dairy Supply Chain Management</h1>
              <p className="text-gray-500 text-2xl">Welcome to the forefront of comprehensive organic dairy supply chain management. Our team is dedicated to revolutionizing the industry through innovative application of blockchain technology.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row w-11/12 h-full gap-10 bg-white p-10 rounded-3xl">
            <div className="flex w-full md:w-1/3 h-full rounded-lg">
              <img src="/images/MeetTeamPic2.avif" alt="farm" className="w-full h-full rounded-3xl" />
            </div>
            <div className="flex flex-col w-full md:w-2/3 h-full justify-center items-start gap-5">
              <div className="flex flex-col gap-5 border-b-2 pb-5">
                <h1 className="text-4xl font-semibold text-[#3D405B]">Our Offering</h1>
                <p className="text-gray-500 text-2xl">Discover our commitment to sustainable sourcing, uncompromising quality assuracne, and cutting-edge blockchain integration.
                  We're passionate about transparency and efficiency throughout the organic dairy supply chain.
                </p>
              </div>
              <div className="flex flex-col gap-5">
                <p className="text-2xl text-gray-500">1. Build a User-Friendly Platform</p>
                <p className="text-2xl text-gray-500">2. Ensure Data Integrity and Security</p>
                <p className="text-2xl text-gray-500">3. Blockchain Integration</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* end meet team section */}

      {/* Contact us section */}
      <div className="flex flex-col w-full h-full min-h-full bg-white p-10" id="contact">
        <h1 className="text-5xl font-bold text-[#3D405B] text-start p-10">Contact Purely Trace</h1>
        <div className="flex flex-col md:flex-row w-full h-full">
          {/* left part */}
          <div className="flex flex-col w-full md:w-1/2 h-full justify-center items-start px-10 gap-5">
            <div className="flex w-full h-full items-start gap-10">
              <input type="text" placeholder="Full Name" className="p-3 text-[#3D405B] text-xl rounded-full border-2 w-full md:w-1/2" />
              <input type="text" placeholder="Email" className="p-3 text-[#3D405B] text-xl rounded-full border-2 w-full md:w-1/2" />
            </div>
            <textarea name="message" id="message" placeholder="Message" className="p-3 w-full border-2 rounded-3xl h-28 text-xl"></textarea>
            <button className="bg-[#f2cc8f] text-white font-semibold p-3 rounded-full w-full text-xl">Submit Feedback</button>
          </div>
          {/* end left part */}

          {/* right part */}
          <div className="flex w-full md:w-1/2 h-full justify-center items-center">
            <div className="flex flex-col w-full md:w-1/2 h-full justify-center items-center gap-5 bg-[#3D405B] rounded-3xl text-center text-white z-10">
              <div className="flex flex-col gap-5 p-10">
                <p className="text-xl font-semibold text-white text-center align-middle">King Mongkut's Institute of Technology Ladkrabang, Thailand</p>
                <p className="text-xl">(+66) 02 329 8000</p>
                <p className="text-xl">64070264@kmitl.ac.th</p>
                <p className="text-xl">64070266@kmitl.ac.th</p>
              </div>

              <a className="bg-[#df7a5f] w-full h-full rounded-b-3xl text-xl font-semibold p-3 cursor-pointer">Direction</a>
            </div>
            <img src="/images/WorldMap.svg" alt="WorldMap" className="absolute z-0 w-1/2" />
          </div>
          {/* end right part */}
        </div>
      </div>
      {/* end contact us section */}

      {/* Footer */}
      <div className="flex flex-col md:flex-row w-full h-full justify-between items-center bg-white text-[#3D405B]">
        <div className="flex w-full md:w-1/2 h-full justify-start items-start p-10">
          <img src="/images/LogoNoBgNoTxt.png" alt="Logo" className="w-24 h-24" />
          <div className="flex flex-col justify-center items-start">
            <p className="text-xl font-bold">Purely</p>
            <small className="font-bold">TRACE</small>
          </div>
        </div>

        <div className="flex w-full md:w-1/2 h-full justify-start items-center gap-10 p-10">
          <div className="flex flex-col w-full md:w-2/3 h-full gap-5">
            <h1 className="text-2xl font-semibold">Contact Us</h1>
            <div className="flex flex-col md:flex-row justify-evenly gap-10 text-gray-500 border-b-2 pb-5">
              <p className="text-xl font-semibold">Nawisa<br></br>Thanasuttawong</p>
              <p className="text-xl">64070264@kmitl.ac.th</p>
            </div>
            <div className="flex flex-col md:flex-row justify-evenly gap-10 text-gray-500">
              <p className="text-xl font-semibold">Pinya<br></br>Nuangudom</p>
              <p className="text-xl">64070266@kmitl.ac.th</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
