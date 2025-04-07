export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ContactRedirect() {
  return {
    redirect: {
      destination: '/en/contact',
      permanent: false,
    },
  };
} 