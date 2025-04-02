import React from 'react'
import ResourceItem from './ResourceItem';

function ResourceItemList({resources, onChange, onCheckSimilarity}) {
    const addResource = ()=>{
        onChange([...resources, {title: '', url: '', description: ''}]);
    };

    const updateResource = (index, key, value)=>{
        const updateResources = [...resources];
        updateResources[index] = {...updateResources[index], [key]:value}
        onChange(updateResources);

        if(key === 'url' && value.trim()){
            onCheckSimilarity && onCheckSimilarity(value);
        }
    };

    const removeResource = (index)=>{
        if(resources.length === 1){
            onChange([{title: '', url: '', description: ''}]);
            return;
        }

        const updatedResources = resources.filter((_, i)=> i!== index);
        onChange(updatedResources);
    }
  return (
    <div className='space-y-4'>
        {resources.map((resource, index)=>(
            <ResourceItem
            key={index}
            resource={resource}
            onChange={(key, value) => updateResource(index, key, value)}
            onRemove={()=>removeResource(index)}
            showRemove={resources.length > 1}
            index={index}
            />
        ))}
        <div>
            <button
            type="button"
            onClick={addResource}
            className="inline-flex items-center px-3 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
                Add Another Resource
            </button>
        </div>
    </div>
  )
}

export default ResourceItemList