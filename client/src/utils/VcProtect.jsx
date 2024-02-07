import React from 'react';
// import {ErrorBoundary} from 'react-error-boundary'
import ErrorBoundary from './ErrorBoundary';
import RoomPage from '../Pages/User/RoomPage';


const VcProtect = () => {
  return (
    <ErrorBoundary>
        <RoomPage/>
    </ErrorBoundary>
  )
}

export default VcProtect