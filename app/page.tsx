import EfreiLogo from "@/app/ui/efrei-logo";
import Link from "next/link";
import Image from "next/image";
import { Nunito } from "next/font/google";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["900"],
});

export default function Page() {
  return (
    <>
      <main className="flex min-h-screen">
        <div className="relative w-2/3 min-h-screen">
          <Image
            src="/myefrei-background.3030cf25.jpg"
            alt={"logo"}
            layout="fill"
            objectFit="cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <EfreiLogo width={650} />
          </div>
        </div>

        <div className="relative w-1/3 flex items-center justify-center p-10 bg-white overflow-hidden">
          <div className="relative flex flex-col justify-center gap-4 px-6 py-10 md:w-3/4 md:px-10">
            <p
              className={`${nunito.className} text-5xl font-bold text-blue-900`}
            >
              BIENVENUE
            </p>
            <Image
              src="/triangles-left.svg"
              alt="Triangle gauche"
              width={50}
              height={50}
              className="absolute top-14 -left-6"
            />
            <Image
              src="/triangles-right.svg"
              alt="Triangle droit"
              width={50}
              height={50}
              className="absolute top-5 right-8"
            />
            <p
              className={`${nunito.className} text-xl font-semibold text-orange-500`}
            >
              SUR LA PLATEFORME WEB DE L'EFREI
            </p>
            <p className="text-md text-gray-700">
              Retrouvez l'ensemble de vos{" "}
              <span className="font-bold">services sur myEfrei</span>.
            </p>
            <Link
              href="/login"
              className="mt-4 flex items-center gap-5 self-start rounded-lg bg-blue-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-950 md:text-base"
            >
              SE CONNECTER
            </Link>
          </div>

          <Image
            src="/logo-pantheon.svg"
            alt="Pantheon logo"
            width={900}
            height={900}
            className="absolute bottom-0 right-0 opacity-5 max-w-none pointer-events-none translate-x-1/2"
          />
        </div>
      </main>
    </>
  );
}
