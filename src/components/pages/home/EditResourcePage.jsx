import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthProvider';
import { useLoading } from '../../context/LoadingContext';
import Header from '../../layout/Header';
import Footer from '../../layout/Footer';
import ResourceEditor from '../../resources/ResourceEditor';

function EditResourcePage() {
    const {id} = useParams();
    const navigate = useNavigate();
    const {user, loading, refreshAccessToken} = useAuth();
    const {showLoading, hideLoading} = useLoading();

    const [resource, setResource] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unauthorized, setUnauthorized] = useState(false);

    useEffect(()=>{
        const fetchResource = async () => {
            if(!id) return;

            try {
                setIsLoading(true);
                showLoading('Loading Resources...');

                let token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');

                if(!token){
                    token = await refreshAccessToken();
                }

                const response = await fetch(
                        `https://resource-base-backend-production.up.railway.app/api/resources/${id}`, {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                );

                if(!response.ok){
                    if(response.status === 403 || response.status === 401){
                        setUnauthorized(true);
                        throw new Error("You don't have permission to edit this page");
                    }
                }

                const data = await response.json();

                if(data.user_id !== user?.id){
                    setUnauthorized(true);
                    throw new Error("You can only edit your own resources");
                }

                const formattedData = {
                    title: data.post_title,
                    description: data.post_description,
                    category: data.category_id,
                    resources: data.resources.map(res => ({
                        id: res.id,
                        title: res.title,
                        description: res.description,
                        url: res.url,
                        thumbnail_url: res.thumbnail_url,
                        favicon_url: res.favicon_url,
                        site_name: res.site_name
                    })),
                    tags: data.tags || []
                };

                // console.log(formattedData);
                

                setResource(formattedData);
                setIsLoading(false);
                hideLoading();
            } catch (error) {
                console.error('Error loading resource:', error);
                setError(error.message);
                setIsLoading(false);
                hideLoading();
            }
        }

        if(user){
            fetchResource();
        }
    }, [id, user]);

    if (loading || (isLoading && !error)) {
        return (
          <>
            <Header />
            <div className="container mx-auto px-4 py-16 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
            <Footer />
          </>
        );
      }

    if (!user) {
        return <Navigate to={`/login?redirect=/resources/edit/${id}`} />;
    }

    if (unauthorized) {
        return (
          <>
            <Header />
            <div className="container mx-auto px-4 py-8 max-w-4xl">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                <p className="font-bold">Unauthorized</p>
                <p>{error || "You don't have permission to edit this resource"}</p>
              </div>
              <div className="flex justify-center mt-6">
                <button 
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Go Back
                </button>
              </div>
            </div>
            <Footer />
          </>
        );
      }
    
  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <ResourceEditor initialData={resource} isEdit={true} resourceId={id} />
        {/* Hi, I am Pritom */}
      </div>
      <Footer />
    </>
  )
}

export default EditResourcePage