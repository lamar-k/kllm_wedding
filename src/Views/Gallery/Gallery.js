import React, {useEffect, useMemo, useState} from "react";
import {ContainerClient } from "@azure/storage-blob";
import Navigation from "../../Components/Navigation/Navigation";

const Gallery = () => {

    const account = process.env.REACT_APP_AZURE_STORAGE_ACCOUNT;
    const containerName = process.env.REACT_APP_AZURE_STORAGE_CONTAINER;
    const manifest_file = "manifest_images.json";

    const containerUrl = useMemo(() => 
        `https://${account}.blob.core.windows.net/${containerName}`,
    [account, containerName]
    );

    const [images, setImages] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
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
        return () => {
            cancelled = true;
        };
    }, [containerUrl, manifest_file]);

    if (loading) {
        return <div>Loading...</div>;
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
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 12,
          maxWidth: 1200,
          justifyContent: "center",
        margin: "0 auto",
        marginTop: 40,
        }}
      >
        {images.map((it) => {
          const url = `${containerUrl}/${encodeURI(it.name)}`;
          const label = it.alt || it.caption || it.name.split("/").pop();
          return (
            <figure key={it.name} style={{ margin: 0 }}>
              <img
                src={url}
                loading="lazy"
                style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 8 }}
              />
            </figure>
          );
        })}
      </div>
        </div>
    )
}

export default Gallery;