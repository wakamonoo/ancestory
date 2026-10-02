import Cover from "@/assets/cover.png";
import AboutImage1 from "@/assets/aboutImage1.png";
import ScratchedImage from "@/assets/scratchedImage.png";
import Fill from "@/assets/black-paper.png";
import Image from "next/image";
import { BiLeaf } from "react-icons/bi";
import { BsHouse, BsHouseFill } from "react-icons/bs";
import { FaChildReaching } from "react-icons/fa6";
import SecondaryButton from "@/components/buttons/secondaryButton";
import RegularButton from "@/components/buttons/regularButton";
import { FaArrowRight } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useLoader } from "@/context/loaderContext";
import { useNavigation } from "@/context/navigationContext";
import { useStory } from "@/context/storyContext";
import { useUser } from "@/context/userContext";

export default function About() {
  const { user, setShowSignInModal } = useUser();
  const { handleDiscoverClick } = useNavigation();
  const { setShowAddStoryModal } = useStory();

  return (
    <div id="about" className="w-full py-16">
      <div className="relative w-full h-72">
        <div className="inset-0 w-full h-72">
          <Image
            src={Cover}
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

            <h1 className="mt-4 text-2xl text-(--color-panel)">
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
        <div className="inset-0 w-full h-auto opacity-15">
          <Image
            src={AboutImage1}
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
                  <h1 className="text-(--color-bg)/80 text-lg mt-2">01</h1>
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
                  <h1 className="text-(--color-bg)/80 text-lg mt-2">02</h1>
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
                  <h1 className="text-(--color-bg)/80 text-lg mt-2">03</h1>
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
      <div className="relative bg-accent w-full overflow-hidden">
        <div className="absolute top-1/2 -translate-y-1/2 -right-4 w-[70%] sm:w-[60%] md:w-1/2 h-auto">
          <Image
            src={ScratchedImage}
            alt="About Image"
            className="w-full h-full object-right"
          />
        </div>

        <div className="inset-0 w-full">
          <Image
            src={Fill}
            alt="About Image"
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-linear-to-r from-(accent) via-(--color-accent) to-transparent" />
        <div className="relative max-w-5xl p-8 md:px-16 lg:px-32 xl:px-64">
          <div className="flex gap-2 items-center">
            <p className="font-alt font-semibold uppercase text-base text-(--color-bg)/80 tracking-widest">
              Where it came from
            </p>
            <div className="w-32 h-px bg-(--color-panel)/60" />
          </div>

          <h1 className="mt-4 text-2xl text-(--color-panel)">
            What happens to a story when there is no one left to tell it?
          </h1>
          <p className="mt-2 text-base text-(--color-bg)/80 leading-tight">
            Across towns and villages, stories are passed from grandparents to
            grandchildren, from neighbors to neighbors, and from one generation
            to the next.
            <br /> <br />
            Some explain the name of a place, some tell of people who once lived
            there. Some are strange, some are beautiful, and some may be
            difficult to explain.
            <br /> <br />
            But once the people who remember them are gone, the stories can
            dissapear with them.
            <br /> <br />
            AnceStory was created to give those stories somewhere to remain.
          </p>
        </div>
      </div>
      <div className="w-full">
        <div className="flex flex-col items-start justify-center p-8 md:px-16 lg:px-32 xl:px-64">
          <div className="flex flex-col items-start">
            <div className="w-32 h-px bg-(--color-accent)/60" />
            <h1 className="mt-4 text-2xl text-brown">
              There are still stories waiting to be remembered.
            </h1>
            <p className="mt-2 text-base text-accent leading-tight">
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
