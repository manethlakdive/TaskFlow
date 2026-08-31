import RotatingText from "../effects/RotatingText/RotatingText";
import GradientWaves from "../effects/GradientWaves/GradientWaves";

export default function Hero({
  greeting,
  heading,
  rotatingTexts,
  subtitle,
  buttonText,
  onButtonClick,
}) {
  return (
    <section className="relative min-h-[55vh] md:min-h-[60vh] overflow-hidden bg-slate-950 text-white flex items-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0">
        <GradientWaves
          horizonColor="#0f0c29"
          waveColor="#6366f1"
          crestColor="#c7d2fe"
          speed={0.35}
          amplitude={3.5}
          waveScale={0.55}
          swell={40}
          turbulence={22}
          opacity={1}
          mouseInteraction
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-950/60 pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
        {greeting && (
          <p className="text-indigo-200 font-medium mb-3 tracking-wide">
            {greeting}
          </p>
        )}

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">
          {heading}
        </h1>

        {rotatingTexts?.length > 0 && (
          <div className="flex justify-center mb-6">
            <RotatingText
              texts={rotatingTexts}
              mainClassName="text-3xl md:text-5xl font-extrabold text-indigo-300"
              staggerFrom="last"
              staggerDuration={0.02}
              rotationInterval={2200}
              splitBy="characters"
            />
          </div>
        )}

        <p className="text-indigo-100/90 text-base md:text-lg max-w-xl mx-auto mb-8">
          {subtitle}
        </p>

        {buttonText && (
  <button
    onClick={onButtonClick}
    className="bg-white text-indigo-700 font-semibold px-6 py-3 rounded-lg hover:bg-indigo-100 transition-colors"
  >
    {buttonText}
  </button>
)}
      </div>
    </section>
  );
}