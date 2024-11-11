import Candidate from "../models/cadidateModel";
export const seedCandidates = async() => {
  try {
    if ((await Candidate.find({})).length> 0) return;
    const candidates = [
        {name: "Donald Trump", image:"https://media-cldnry.s-nbcnews.com/image/upload/t_fit-1500w,f_auto,q_auto:best/newscms/2020_43/3421971/201021-donald-trump-dance-ew-621p.jpg"},
        {name: "George W. Bush", image:"https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/George-W-Bush.jpeg/640px-George-W-Bush.jpeg"},
        {name: "Abraham Lincoln", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Abraham_Lincoln_O-77_matte_collodion_print.jpg/800px-Abraham_Lincoln_O-77_matte_collodion_print.jpg" }
    ]
    await Candidate.insertMany(candidates).then(_=>console.log("Seeded Candidates")).catch(err => console.error(err.message));
     return;
  } catch (err) {
    console.error(err.message);
    return;
  }
};
