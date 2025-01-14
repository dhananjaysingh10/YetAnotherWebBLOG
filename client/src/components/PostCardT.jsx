import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
export default function PostCardT({ post }) {
  const location = useLocation(); 
  const isTemplatePage = location.pathname.includes('/templates');
  const linkPath = isTemplatePage
    ? `/template/${post.slug}`:
    `/post/${post.slug}`; 
  return (
    <div className='group relative w-full border-2 border-black-600  hover:border-4 h-[250px] overflow-hidden rounded-lg sm:w-[280px] transition-all'>
      {/* <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt='post cover'
          className='h-[260px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
        />
      </Link> */}
      <div className='p-3 flex flex-col gap-2'>
        <p className='text-lg font-semibold line-clamp-2'>{post.slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        }</p>
        <span className='italic text-sm'>{post.category}</span>
        
        
        <Link
        
          to={`${linkPath}`}
          className='z-10 bottom-0 absolute  left-0 right-0 border-2 border-amber-400 text-amber-400 hover:bg-black hover:text-white hover:border-white transition-all duration-300 text-center py-2 rounded-md !rounded-tl-none m-2 font-semibold'
        >
          Read article
        </Link>
      </div>
    </div>
  );
}