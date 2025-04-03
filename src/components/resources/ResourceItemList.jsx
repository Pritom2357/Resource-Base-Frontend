import React, { useEffect } from 'react';
import ResourceItem from './ResourceItem';

function ResourceItemList({ resources, onChange, onCheckSimilarity }) {
  const handleResourceChange = (index, field, value) => {
    const updatedResources = [...resources];
    
    if (!updatedResources[index]) {
      updatedResources[index] = {};
    }
    
    updatedResources[index][field] = value;
    
    // console.log(`Updated resource ${index}, field ${field}:`, value);
    // console.log("New resources state:", updatedResources);
    
    onChange(updatedResources);
  };

  const addResource = () => {
    onChange([...resources, { title: '', url: '', description: '' }]);
  };

  const removeResource = (index) => {
    const updatedResources = [...resources];
    updatedResources.splice(index, 1);
    onChange(updatedResources);
  };

  return (
    <div className="space-y-4">
      {resources.map((resource, index) => (
        <ResourceItem
          key={index}
          resource={resource}
          index={index}
          showRemove={resources.length > 1}
          onChange={(field, value) => handleResourceChange(index, field, value)}
          onRemove={() => removeResource(index)}
          onUrlChange={onCheckSimilarity}
        />
      ))}
      
      <div className="flex justify-end">
        <button
          type="button"
          onClick={addResource}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add another resource
        </button>
      </div>
    </div>
  );
}

export default ResourceItemList;

// useEffect(() => {
//   console.log("Resource changed:", resource);
// }, [resource]);