import React from 'react';
import NICScanner from './Real-time NIC Scanning/Components/NICScanner';
import LivenessCheck from './Real-time NIC Scanning/Components/LivenessCheck';
import OCRRecorder from './Video Recorder/OCRRecorder';
import FormRecorder from './Video Recorder/FormRecorder';

const App: React.FC = () => {
  return(
    <>
      <h1 className='text-2xl flex justify-center items-center'>Ankit Singh</h1>
      <NICScanner/>
      {/* <LivenessCheck/> */}
      {/* <OCRRecorder/> */}
      {/* <FormRecorder/> */}
    </>
  )

};

export default App;
