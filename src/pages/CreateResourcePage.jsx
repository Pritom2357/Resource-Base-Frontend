import React from 'react'
import { useAuth } from '../context/AuthProvider'
import Layout from '../components/layout/Layout';
import { Navigate } from 'react-router-dom';
import ResourceEditor from '../components/Resources/editor/ResourceEditor';
import ErrorBoundary from './ErrorBoundary';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

function CreateResourcePage() {
    const {user, loading} = useAuth();
    // console.log("Auth State: ", {user, loading});
    

    if(loading){
        return (
            <Layout>
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
            </Layout>
        );
    }

    if(!user){
        return <Navigate to='/login?redirect=/create-resource'/>
    }
  return (
     <>
        <div className='container mx-auto px-4 py-8 max-w-4xl'>
            <ResourceEditor/>
        </div>
    </>
  )
}

export default CreateResourcePage