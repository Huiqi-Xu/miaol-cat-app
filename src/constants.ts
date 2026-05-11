import { EncyclopediaEntry } from './types';

export const ENCYCLOPEDIA_ENTRIES: EncyclopediaEntry[] = [
  {
    id: 'happy',
    title: '幸福满足',
    description: '通常伴随着轻微的呼噜声，表示猫咪此时感到非常安全。这是一种极其放松的状态。',
    moodTag: '心情愉悦',
    icon: 'smile',
    color: 'primary'
  },
  {
    id: 'hungry',
    title: '肚子饿了',
    description: '短促而连贯的"喵喵"声，通常伴随着绕脚行为，这是猫咪在向你发出进食请求。',
    moodTag: '有需求',
    icon: 'utensils',
    color: 'primary-container'
  },
  {
    id: 'warning',
    title: '低鸣警告',
    description: '深沉的喉音或嘶嘶声，意味着猫咪感到受威胁或极度不安，建议给它独立空间。',
    moodTag: '警惕状态',
    icon: 'triangle-alert',
    color: 'error'
  },
  {
    id: 'mating',
    title: '寻找伙伴',
    description: '悠长且带有音调起伏的鸣叫，通常在夜晚发生，这是猫咪在呼唤同伴的声音。',
    moodTag: '社交寻偶',
    icon: 'heart',
    color: 'secondary'
  }
];

export const BREEDS = [
  {
    id: 'orange',
    name: '橘猫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgC_Mp2sISMQkzPqxvws5nN_XZQD7p-C1xdy3HETN9nq_ZbbaPCTmsWPz93a6eYR_br4TIh3tca-avx4Os-fYhB07vngraZpW-B_SbDCU6g2ydso2XnknULvMnGv5Q7N5GXBZRcZf9g2aEuSz1hkWZmdP8nD4P6f1CBzQ6CKHcK52lvtFsZW_N-ubP-erExfZh1sfmKsxGHLgpJkLo3G0IVQFMQIFlewRefCYxVuH7DWL3bZ9qt4osBpBktI3XP5guI4T1021_-4GA'
  },
  {
    id: 'calico',
    name: '三花猫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuClyuQw3XL5KUQvyQQsVFt_cFJftIRgJLOzYD7r69AHKHTqC2dnySXLGyqRdMVRu3S_2dhS0sq9B-w1wNogIZdfG64h77B_pAnoKtPSX_eDkty_k0cmhkoV9O-TfAEY3VPHxgEVh4RuwxG8jQCKYFpd0hkuV_xSlg-lEkafVuj11cGjZjckb6yoocdFyJAz3dc4fFujlugs1hbr9v3ezAdpiKfTD2GYfTA0cY-7ERYAVLp0mfEVMPbAfOD9Yb8dkN-snBnAatGLUJpq'
  },
  {
    id: 'british',
    name: '英短猫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_oo2ANPqLKs-kgRRIq7O_hoV5jOp6c0Uv6heIjIqs9MdHnehUrB3vuH9Zbg9uMvedKq_uf37EUbC06oykWHZM_x76mN-Usnd3EJB2pX9BBftweCUcJg76Mv_SYpt4XgHH9STFL2dlyj9Al1wDjNQjzej85Ue0r0y_f1wtVCvLkXaLpm8nGZKYiM_SMKFx1kFyKr7ouyJ5SYapwStHbKVbrhWz-SeyAGACTBBBPmzsHOeK24N_0696fe1reX5takPIR39ck6JBOf-v'
  },
  {
    id: 'ragdoll',
    name: '布偶猫',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyKnbEzyVl5_-CPyho_Oks3dJEX5NcEZseY66zRPXG9nBlYKyFNpGnJdDx3lmJncAm99sJoXM818i6ypK-F5tiYXKIEi1C_huI77Jx96i8MChOQ6VOe07JmOZXtM6LxKbqXBKSjNodkPPIxVVHzxU7kbw7SV77FXE-qtGDwkfjMIethh85onmLgNDoQxdj30uZp1rc-lojntogXgHX_CTLCfqSuf189cDwu_VZZcHvZXmMK2oX6W4nGruB6VJh2D4skufcGijBMhht'
  }
];
