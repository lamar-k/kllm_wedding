import React, {useEffect, useMemo, useState} from "react";
import {ContainerClient } from "@azure/storage-blob";
import Navigation from "../../Components/Navigation/Navigation";

const Gallery = () => {

    // Set to true to use mock data, false to fetch from Azure
    const mock_data = true;

    const account = process.env.REACT_APP_AZURE_STORAGE_ACCOUNT;
    const containerName = process.env.REACT_APP_AZURE_STORAGE_CONTAINER;
    const manifest_file = "manifest_images.json";

    const containerUrl = useMemo(() => 
        `https://${account}.blob.core.windows.net/${containerName}`,
    [account, containerName]
    );

    // Mock images for preview with varying sizes
    const mockImages = [
        { name: "wedding-1.jpg", alt: "Beautiful wedding ceremony", width: 300, height: 400 },
        { name: "wedding-2.jpg", alt: "Bride and groom", width: 300, height: 200 },
        { name: "wedding-3.jpg", alt: "Wedding reception", width: 300, height: 300 },
        { name: "wedding-4.jpg", alt: "Wedding cake", width: 300, height: 250 },
        { name: "wedding-5.jpg", alt: "First dance", width: 300, height: 450 },
        { name: "wedding-6.jpg", alt: "Wedding party", width: 300, height: 180 },
        { name: "wedding-7.jpg", alt: "Bouquet toss", width: 300, height: 350 },
        { name: "wedding-8.jpg", alt: "Wedding decorations", width: 300, height: 220 },
        { name: "wedding-9.jpg", alt: "Wedding venue", width: 300, height: 280 },
        { name: "wedding-10.jpg", alt: "Wedding celebration", width: 300, height: 320 },
        { name: "wedding-11.jpg", alt: "Wedding moments", width: 300, height: 200 },
    ];

    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        
        if (mock_data) {
            // Using mock images for preview
            setLoading(true);
            setTimeout(() => {
                if(!cancelled) {
                    setImages(mockImages);
                    setLoading(false);
                }
            }, 500); // Simulate loading delay
        } else {
            // Fetch from Azure storage
            (async () => {
                try{
                    setLoading(true);
                    setError("");
                    const res = await fetch(`${containerUrl}/${manifest_file}`);
                    if(!res.ok) {
                        throw new Error(`HTTP error! status: ${res.status}`);
                    }
                    const data = await res.json();
                    const normalizedImages = (Array.isArray(data) ? data:[])
                    .map(it => (typeof it === 'string' ? {name: it} : it))
                    .filter(it => it?.name && /\.(jpg|jpeg|png|gif)$/i.test(it.name));
                    if(!cancelled) {
                        setImages(normalizedImages);
                    }
                }
                catch(err) {
                    if(!cancelled) {
                        setError(err.message || "Failed to load images");
                    }
                }
                finally {
                    if(!cancelled) {
                        setLoading(false);
                    }
                }
            })();
        }
        
        return () => {
            cancelled = true;
        };
    }, [containerUrl, manifest_file, mock_data]);

    if (loading) {
        return <div style={{justifyContent:'center', alignItems:'center', marginTop:'50%'}}>Loading...</div>;
    } 
if (error) {
        return <div>Error: {error}</div>;
    }
    if (images.length === 0) {
        return <div>No images found.</div>;
    }
    return(
        <div>
            <Navigation />

            <div
              style={{
                maxWidth: 1200,
                margin: "0 auto",
                padding: "40px 20px",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
                  gridAutoRows: "10px",
                  gap: 12,
                }}
              >
                {images.map((it, index) => {
                  // Use placeholder images for mock data, Azure URL for real data
                  const imageWidth = it.width || 300;
                  const imageHeight = it.height || 180;
                  const aspectRatio = imageHeight / imageWidth;
                  const rowSpan = Math.ceil((imageHeight + 12) / 10); // 12px gap, 10px row height
                  
                  const url = mock_data 
                    ? `https://picsum.photos/seed/${it.name}/${imageWidth}/${imageHeight}`
                    : `${containerUrl}/${encodeURI(it.name)}`;
                  const label = it.alt || it.caption || it.name.split("/").pop();
                  return (
                    <figure 
                      key={it.name} 
                      style={{ 
                        margin: 0,
                        gridRowEnd: `span ${rowSpan}`,
                        overflow: "hidden",
                        borderRadius: 8,
                        width: "100%",
                        height: "100%"
                      }}
                    >
                      <img
                        src={url}
                        alt={label}
                        loading="lazy"
                        style={{ 
                          width: "100%", 
                          height: "100%", 
                          objectFit: "cover",
                          display: "block"
                        }}
                      />
                    </figure>
                  );
                })}
              </div>
            </div>
        </div>
    )
}

export default Gallery;