"use client";
import Opinion from "./opinion/Opinion";
import Navbar from "./navbar/Navbar";
import {
  BackgroundSection,
  GlobalStyle,
  MainContent,
  NavbarOverlay,
} from "./background/background";
import { CardItem, CardContainer } from "./product_items/card_item";

export default function Home() {
  return (
    <div>
      <GlobalStyle />
      <NavbarOverlay>
        <Navbar />
      </NavbarOverlay>
      <BackgroundSection />
      <Opinion />
      <MainContent>
        <CardContainer>
          <CardItem
            imageUrl="/1.jpg"
            onBuyClick={() => alert("Buying product 2")}
            onOpinionClick={() => alert("Give opinion on product 2")}
          />
          <CardItem
            imageUrl="/2.jpg"
            onBuyClick={() => alert("Buying product 2")}
            onOpinionClick={() => alert("Give opinion on product 2")}
          />
          <CardItem
            imageUrl="/3.jpg"
            onBuyClick={() => alert("Buying product 3")}
            onOpinionClick={() => alert("Give opinion on product 3")}
          />
          <CardItem
            imageUrl="/4.jpg"
            onBuyClick={() => alert("Buying product 3")}
            onOpinionClick={() => alert("Give opinion on product 3")}
          />
          <CardItem
            imageUrl="/5.jpg"
            onBuyClick={() => alert("Buying product 3")}
            onOpinionClick={() => alert("Give opinion on product 3")}
          />
          <CardItem
            imageUrl="/6.jpg"
            onBuyClick={() => alert("Buying product 3")}
            onOpinionClick={() => alert("Give opinion on product 3")}
          />
        </CardContainer>
      </MainContent>
    </div>
  );
}
