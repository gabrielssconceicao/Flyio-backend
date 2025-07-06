import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components';

interface ReactivationLinkTemplateProps {
  userEmail: string;
  reactivationLink?: string;
}

export function ReactivationLinkTemplate({
  userEmail,
  reactivationLink,
}: ReactivationLinkTemplateProps) {
  const previewText = `Reative sua conta na Pizza Shop`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="bg-white my-auto mx-auto font-sans">
          <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] w-[465px]">
            <Section className="mt-[32px] text-center">
              <span className="text-2xl">🪰</span>
            </Section>
            <Heading className="text-black text-[24px] font-normal text-center p-0 my-[30px] mx-0">
              Reative sua conta na Flyio
            </Heading>
            <Text className="text-black text-[14px] leading-[24px]">
              Olá! Recebemos uma solicitação para reativar a conta associada ao
              email {userEmail}.
            </Text>

            <Section className="text-center mt-[32px] mb-[32px]">
              {reactivationLink ? (
                <Button
                  className="bg-sky-500 rounded text-white px-5 py-3 text-[12px] font-semibold no-underline text-center"
                  href={reactivationLink}
                >
                  Reativar conta
                </Button>
              ) : (
                <span className="text-red-500 text-[14px]">
                  Link de reativação indisponível
                </span>
              )}
            </Section>

            {reactivationLink && (
              <Text className="text-black text-[14px] leading-[24px]">
                Ou copie a URL abaixo e cole em seu navegador:{' '}
                <Link
                  href={reactivationLink}
                  className="text-sky-500 no-underline"
                >
                  {reactivationLink}
                </Link>
              </Text>
            )}

            <Hr className="border border-solid border-[#eaeaea] my-[26px] mx-0 w-full" />

            <Text className="text-[#666666] text-[12px] leading-[24px]">
              Se você não solicitou a reativação da conta, pode ignorar este
              e-mail com segurança.
            </Text>

            <Text className="text-[#999999] text-[12px] leading-[20px] mt-[16px]">
              ⚠️ Caso você não veja este e-mail na sua caixa de entrada
              principal, verifique a pasta de <strong>Spam</strong> ou{' '}
              <strong>Lixo Eletrônico</strong>.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
