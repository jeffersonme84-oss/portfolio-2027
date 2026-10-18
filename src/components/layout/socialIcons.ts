import type { IconType } from 'react-icons'
import { FaLinkedinIn } from 'react-icons/fa'
import { SiBehance, SiDribbble, SiGithub, SiInstagram } from 'react-icons/si'
import type { SocialNetwork } from '@/content/site'

// O simple-icons removeu a marca do LinkedIn; o ícone vem do Font Awesome.
export const socialIcons: Record<SocialNetwork, IconType> = {
  linkedin: FaLinkedinIn,
  github: SiGithub,
  behance: SiBehance,
  instagram: SiInstagram,
  dribbble: SiDribbble,
}
