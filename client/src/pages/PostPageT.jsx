import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(false);
        const res = await fetch(`/api/template/gettemplate?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        } else {
          console.log(data.templates[0]);
          setPost(data.templates[0]);
          setError(false);
          setLoading(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  const copyToClipboard = (code) => {
    const formattedCode = code.replace(/\\n/g, '\n');
    navigator.clipboard.writeText(formattedCode)
  };
  
  

  useEffect(() => {
    // Attach event listeners to buttons after the content is rendered
    const buttons = document.querySelectorAll(".copy-code-btn");
    buttons.forEach((button) => {
      button.addEventListener("click", (e) => {
        const codeContent = e.target.getAttribute("data-code");
        copyToClipboard(codeContent);
      });
    });

    // Cleanup event listeners when component is unmounted
    return () => {
      buttons.forEach((button) => {
        button.removeEventListener("click", () => {});
      });
    };
  }, [post]);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );

  return (
    <div>
      <div
        className="p-4 max-w-4xl mx-auto post-content"
        dangerouslySetInnerHTML={{
          __html: post && post.content,
        }}
      />
    </div>
  );
}
