import React, {useEffect, useState} from "react";
import {ContainerClient } from "@azure/storage-blob";
import Navigation from "../../Components/Navigation/Navigation";

const Gallery = () => {

    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        
        (async () => {
            try{
                setLoading(true);
                setError(null);
                
                const apiUrl = process.env.REACT_APP_BACKEND_URL || "http://localhost:8000";
                const tokenResponse = await fetch(`${apiUrl}/api/gallery/sas-token`);
                
                if(!tokenResponse.ok) {
                    throw new Error(`Failed to get SAS token: ${tokenResponse.status}`);
                }
                
                const { containerUrl, sasToken } = await tokenResponse.json();
                
                const containerClient = new ContainerClient(`${containerUrl}?${sasToken}`);
                const blobs = [];
                
                for await (const blob of containerClient.listBlobsFlat()) {
                    if (/\.(jpg|jpeg|png|gif|webp)$/i.test(blob.name) && !blob.name.includes("Tezza-8936.JPG")) {
                        blobs.push({
                            name: blob.name,
                            url: `${containerUrl}/${encodeURIComponent(blob.name)}?${sasToken}`,
                            alt: blob.name.split("/").pop().replace(/\.[^/.]+$/, "")
                        });
                    }
                }
                
                if(!cancelled) {
                    setImages(blobs);
                }
            }
            catch(err) {
                if(!cancelled) {
                    setError(err.message || "Failed to load images");
                    console.error("Gallery error:", err);
                }
            }
            finally {
                if(!cancelled) {
                    setLoading(false);
                }
            }
        })();
        
        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <div>
                <Navigation />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    fontSize: '18px'
                }}>
                    Loading gallery...
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div>
                <Navigation />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    fontSize: '18px',
                    color: '#d32f2f',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    <div>Error loading gallery</div>
                    <div style={{fontSize: '14px', color: '#666'}}>{error}</div>
                </div>
            </div>
        );
    }
    
    if (images.length === 0) {
        return (
            <div>
                <Navigation />
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: '60vh',
                    fontSize: '18px'
                }}>
                    No images found in gallery.
                </div>
            </div>
        );
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
                {images.map((image, index) => {
                  const imageWidth = 300;
                  const imageHeight = 300;
                  const rowSpan = Math.ceil((imageHeight + 12) / 10);
                  
                  return (
                    <figure 
                      key={image.name} 
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
                        src={image.url}
                        alt={image.alt}
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