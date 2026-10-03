import AboutImage1 from "@/assets/aboutImage1.png";
import AboutImage2 from "@/assets/aboutImage2.png";
import AboutImage3 from "@/assets/aboutImage3.png";
import ScratchedImage1 from "@/assets/scratchedImage1.png";
import ScratchedImage2 from "@/assets/scratchedImage2.png";
import Image from "next/image";
import Icon from "@/assets/icon.png";
import { BiLeaf } from "react-icons/bi";
import { BsHouse, BsHouseFill, BsPeopleFill } from "react-icons/bs";
import { FaChildReaching, FaPeopleGroup } from "react-icons/fa6";
import SecondaryButton from "@/components/buttons/secondaryButton";
import RegularButton from "@/components/buttons/regularButton";
import { FaArrowRight } from "react-icons/fa";
import { useNavigation } from "@/context/navigationContext";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";
import Arabasque from "@/assets/arabesque.png";
import { GiCoconuts, GiWoodCabin } from "react-icons/gi";
import { MdCabin } from "react-icons/md";

export default function About() {
  const { user, setShowSignInModal } = useUser();
  const { handleDiscoverClick } = useNavigation();
  const { setShowAddStoryModal } = useStory();

  return (
    <div id="about" className="w-full py-16">
      <div className="relative w-full h-72">
        <div className="inset-0 w-full h-72 pointer-events-none">
          <Image
            src={AboutImage1}
            alt="About Image"
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-(olive) via-(--color-olive)/20 to-transparent" />
        <div className="absolute inset-0 flex justify-start items-center max-w-5xl">
          <div className="p-8 md:px-16 lg:px-32 xl:px-64">
            <div className="flex gap-2 items-center">
              <p className="font-alt font-semibold uppercase text-base text-(--color-bg)/80 tracking-widest">
                About AnceStory
              </p>
              <div className="w-32 h-px bg-(--color-panel)/60" />
            </div>

            <h1 className="mt-4 text-lg leading-tight text-(--color-panel)">
              The stories behind where we come from.
            </h1>
            <p className="mt-2 text-base text-(--color-bg)/80 leading-tight">
              Some stories are written down. Others survive only because someone
              remembers them.
              <br />
              <br />
              AnceStory exists for the ones in between.
            </p>
          </div>
        </div>
      </div>
      <div className="relative bg-olive w-full h-full">
        <div className="inset-0 w-full h-auto opacity-15 pointer-events-none">
          <Image
            src={AboutImage2}
            alt="About Image"
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-8 md:px-16 lg:px-32 xl:px-64">
          <div className="flex gap-2 items-center">
            <p className="font-alt font-semibold uppercase text-base text-(--color-bg)/80 tracking-widest">
              Why AnceStory exist
            </p>
            <div className="w-32 h-px bg-(--color-panel)/60" />
          </div>
          <div className="mt-4 flex items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start divide-y sm:divide-y-0 sm:divide-x divide-(--color-panel)/60">
              <div className="relative p-4 w-fit flex flex-col items-center justify-center">
                <div className="absolute top-4 left-12">
                  <h1 className="text-(--color-bg)/80 text-lg leading-tight mt-2">
                    01
                  </h1>
                </div>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <BiLeaf className="text-4xl shrink-0 text-(--color-bg)/80" />
                  <h1 className="text-base text-(--color-panel) uppercase">
                    Remember
                  </h1>
                </div>

                <p className="mt-2 text-sm max-w-55 text-center text-(--color-bg)/80 leading-tight">
                  We preserve stories before they become memories.
                </p>
              </div>
              <div className="relative p-4 w-fit flex flex-col items-center justify-center">
                <div className="absolute top-4 left-12">
                  <h1 className="text-(--color-bg)/80 text-lg leading-tight mt-2">
                    02
                  </h1>
                </div>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <BsHouseFill className="text-4xl shrink-0 text-(--color-bg)/80" />
                  <h1 className="text-base text-(--color-panel) uppercase">
                    Connect
                  </h1>
                </div>

                <p className="mt-2 text-sm max-w-55 text-center text-(--color-bg)/80 leading-tight">
                  A story is more than a piece of text. It belongs to a person,
                  a place, and a community.
                </p>
              </div>
              <div className="relative p-4 w-fit flex flex-col items-center justify-center">
                <div className="absolute top-4 left-12">
                  <h1 className="text-(--color-bg)/80 text-lg leading-tight mt-2">
                    03
                  </h1>
                </div>
                <div className="flex flex-col gap-2 items-center justify-center">
                  <FaChildReaching className="text-4xl shrink-0 text-(--color-bg)/80" />
                  <h1 className="text-base text-(--color-panel) uppercase">
                    Pass It On
                  </h1>
                </div>

                <p className="mt-2 text-sm max-w-55 text-center text-(--color-bg)/80 leading-tight">
                  AnceStory gives future generations a way to encounter the
                  stories that came before them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="relative bg-accent w-full overflow-hidden"
        style={{
          backgroundImage: `url(${Arabasque.src})`,
          backgroundRepeat: "repeat",
          backgroundSize: "140px 140px",
        }}
      >
        <div className="absolute flex w-full top-1/2 -translate-y-1/2 -right-14 pointer-events-none">
          <div className="flex w-full justify-end items-center">
            <div className="w-[80%] sm:w-[60%] md:w-[40%] sm:mt-8 lg:mt-24 xl:mt-32 2xl:mt-44">
              <Image
                src={ScratchedImage1}
                alt="About Image"
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="w-[80%] sm:w-[60%] md:w-[40%] -ml-24 lg:-ml-32 xl:-ml-44 2xl:-ml-50">
              <Image
                src={ScratchedImage2}
                alt="About Image"
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
        </div>

        <div className="absolute inset-0 bg-linear-to-r from-(accent) via-(--color-accent) lg:via-(--color-accent)/10 to-transparent" />
        <div className="relative max-w-5xl p-8 md:px-16 lg:px-32 xl:px-64">
          <div className="flex gap-2 items-center">
            <p className="font-alt font-semibold uppercase text-base text-(--color-bg)/80 tracking-widest">
              Where it came from
            </p>
            <div className="w-32 h-px bg-(--color-panel)/60" />
          </div>

          <h1 className="mt-4 text-lg leading-tight text-(--color-panel)">
            What happens to a story when there is no one left to tell it?
          </h1>
          <p className="mt-2 text-base text-(--color-bg)/80 leading-tight">
            Across towns and villages, stories are passed from grandparents to
            grandchildren, from neighbors to neighbors, and from one generation
            to the next.
          </p>
        </div>
      </div>

      <div className="relative w-full bg-second  p-8 md:px-16 lg:px-32 xl:px-64">
        <div className="inset-0 w-full h-auto opacity-15 pointer-events-none">
          <Image
            src={AboutImage3}
            alt="About Image"
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 lg:items-center gap-12">
          <div className="flex flex-col divide-y divide(--color-muted)/60">
            <div className="flex items-start gap-2 py-4">
              <div className="flex items-center justify-center bg-accent w-14 h-14 rounded-full shrink-0">
                <MdCabin className="text-4xl text-brand" />
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-base text-brown">
                  Some explain the name of a place,
                </h1>
                <p className="text-sm text-muted leading-tight">
                  some tell of people who once lived there.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 py-4">
              <div className="flex items-center justify-center bg-accent w-14 h-14 rounded-full shrink-0">
                <GiCoconuts className="text-4xl text-brand" />
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-base text-brown">Some are strange,</h1>
                <p className="text-sm text-muted leading-tight">
                  some are beautiful, and some may be difficult to explain.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 py-4">
              <div className="flex items-center justify-center bg-accent w-14 h-14 rounded-full shrink-0">
                <FaPeopleGroup className="text-4xl text-brand" />
              </div>
              <div className="flex flex-col items-start">
                <h1 className="text-base text-brown">
                  But once the people who remember them are gone,
                </h1>
                <p className="text-sm text-muted leading-tight">
                  the stories can dissapear with them.
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center divide-x divide-(--color-muted)/60">
            <div className="pr-4">
              <div className="w-14 h-14 shrink-0">
                <Image
                  src={Icon}
                  alt="Icon"
                  className="w-full h-full object contain"
                />
              </div>
            </div>
            <div className="pl-4">
              <h1 className="text-lg leading-tight text-brown">
                AnceStory was created to give those stories somewhere to remain.
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="flex flex-col items-start justify-center p-8 md:px-16 lg:px-32 xl:px-64">
          <div className="flex flex-col items-start">
            <div className="w-32 h-px bg-(--color-muted)/60" />
            <h1 className="mt-4 text-lg leading-tight text-brown">
              There are still stories waiting to be remembered.
            </h1>
            <p className="mt-2 text-base text-muted leading-tight">
              Maybe one of them belongs to you.
            </p>
          </div>
          <div className="flex flex-wrap w-fit gap-2 mt-4">
            <SecondaryButton onClick={handleDiscoverClick}>
              <p className="font-bold text-brand text-base whitespace-nowrap">
                Explore The Stories
              </p>
              <FaArrowRight className="text-base text-brand shrink-0" />
            </SecondaryButton>
            <RegularButton
              onClick={() => {
                if (user) {
                  setShowAddStoryModal(true);
                } else {
                  setShowSignInModal(true);
                }
              }}
            >
              <p className="font-bold text-brand text-base whitespace-nowrap">
                Share a Story
              </p>
            </RegularButton>
          </div>
        </div>
      </div>
    </div>
  );
}
