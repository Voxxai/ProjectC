
function ForgotPassword() {

    return (
        <div className='h-screen w-screen flex items-center justify-center'>

                {/* Login container */}
                <div className={`${TFAContainer && 'hidden'} w-[550px] p-12 py-24 bg-white shadow-2xl shadow-cavero-purple-light rounded`}>
                    <div className='mb-3'>
                        <h1 className='text-cavero-purple font-semibold'>Login bij Cavero</h1>
                        <p className='text-gray-600 text-md'>Je kunt bij Cavero inloggen met de volgende gegevens.</p>
                    </div>
                    <div className={`bg-red-200 h-10 rounded flex mb-3 ${!error && 'hidden'}`}>
                        <p className='text-black my-auto p-2 text-sm'>{errorMessage}</p>
                    </div>

                    <form>
                        <div className='input-container mb-4'>
                            <div className='flex relative items-center'>
                                <FontAwesomeIcon icon={faEnvelope} color='black' className='absolute w-6 h-6 text-gray-500 p-1' />
                                <input type="email" className='w-full h-12 pl-9 border-none outline-none rounded shadow-none ml-6' name='email' id="email" placeholder="E-mailadres" onChange={handleInput} required />
                            </div>
                            <div className='h-[3px] bg-cavero-purple duration-300 rounded-full ColoredLine'></div>
                        </div>

                        <div className='input-container mb-4'>
                            <div className='flex relative items-center'>
                                <FontAwesomeIcon icon={faLock} color='black' className='absolute w-6 h-6 text-gray-500 p-1' />
                                <input type="password" className='w-full h-12 pl-9 border-none outline-none rounded shadow-none ml-6' name='password' id="password" placeholder="Wachtwoord" onChange={handleInput} required />
                            </div>
                            <div className='h-[3px] bg-cavero-purple duration-300 rounded-full ColoredLine'></div>
                        </div>
                        <div className='flex flex-row items-center mb-3'>
                            <div className='flex-col'>
                                <a href='/register' className='flex-1'>Nog geen account?</a> <br />
                                <a className='flex-1'>Wachtwoord vergeten?</a>
                            </div>
                            <div className='flex-1'></div>
                            <button type="button" className='bg-gradient-to-r from-cavero-purple to-[#c279cc] text-white w-32 h-9 rounded-full duration-300 hover:scale-105 hover:shadow-lg' onClick={getUser}>Login <FontAwesomeIcon icon={faArrowRightLong} color='white' /></button>
                        </div>

                    </form>
                </div>
            </div>
    );
}