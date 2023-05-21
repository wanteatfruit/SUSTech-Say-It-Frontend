import { Button, IconButton } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { BiUpArrowAlt, BiUpArrowCircle } from 'react-icons/bi';
const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <IconButton aria-label='backtotop'
      bgColor='var(--minimal-2)'
    icon={<BiUpArrowAlt size='xl' color='white' />}
      onClick={handleBackToTop}
      _hover={{bgColor:'var(--minimal-3)'}}
      style={{ display: isVisible ? 'block' : 'none', position: 'fixed', bottom: '20px', right: '20px' }}
    >
      返回顶部
    </IconButton>
  );
};

export default BackToTopButton;