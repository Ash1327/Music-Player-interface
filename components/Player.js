import React, { useState, useRef, useEffect } from 'react';
import AudioSpectrum from 'react-audio-spectrum';
import {
    BiPlayCircle,
    BiPauseCircle,
    BiSkipPreviousCircle,
    BiSkipNextCircle
} from 'react-icons/bi';

export default function Player({
    currentSong,
    currentIndex,
    nextSong,
    prevSong
}) {
    const [isPlaying, setIsplaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const audioRef = useRef(null);

    // Toggle Play/Pause
    const togglePlay = () => {
        setIsplaying(!isPlaying);
    };

    // Play/Pause functionality when state changes
    useEffect(() => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.play();
        } else {
            audio.pause();
        }
    }, [isPlaying, currentIndex]);

    // Time tracking and duration
    useEffect(() => {
        const audio = audioRef.current;

        const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
        const handleLoadedMetadata = () => setDuration(audio.duration);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [currentIndex]);

    // Format time to mm:ss
    const formatTime = (time) => {
        if (isNaN(time)) return '00:00';
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    // Handle progress bar change (seeking)
    const handleProgressChange = (e) => {
        const value = e.target.value;
        audioRef.current.currentTime = value;
        setCurrentTime(value);
    };

    return (
        <div>
            {/* Audio Element */}
            <audio
                ref={audioRef}
                id='audio-element'
                src={currentSong.music}
            >
            </audio>

            <div className='player-card'>
                {/* Audio Spectrum */}
                <div className='audio-waveform'>
                    <AudioSpectrum
                        id="audio-canvas"
                        height={110}
                        width={300}
                        audioId={'audio-element'}
                        capColor={'#ffc107'}
                        capHeight={2}
                        meterWidth={5}
                        meterCount={300}
                        meterColor={[
                            { stop: 1, color: '#ff9800' }
                        ]}
                        gap={8}
                    />
                </div>

                {/* Song Info */}
                <h2 className='activeSong-name'>{currentSong.name}</h2>
                <h4 className='activeArtist-name'>{currentSong.creator}</h4>

                {/* Music Progress Bar with Timer */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
                    <span style={{ color: 'white', marginRight: '10px' }}>{formatTime(currentTime)}</span>
                    <input
                        type='range'
                        min='0'
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleProgressChange}
                        style={{ width: '60%' }}
                    />
                    <span style={{ color: 'white', marginLeft: '10px' }}>{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className='control-icon'>
                    <BiSkipPreviousCircle
                        color='white'
                        className='icons'
                        size={50}
                        onClick={prevSong}
                    />
                    {isPlaying ? (
                        <BiPauseCircle
                            color='#ff5722'
                            className='icons'
                            size={70}
                            onClick={togglePlay}
                        />
                    ) : (
                        <BiPlayCircle
                            color='#ff5722'
                            size={70}
                            className='icons'
                            onClick={togglePlay}
                        />
                    )}
                    <BiSkipNextCircle
                        color='white'
                        size={50}
                        className='icons'
                        onClick={nextSong}
                    />
                </div>
            </div>
        </div>
    );
}
