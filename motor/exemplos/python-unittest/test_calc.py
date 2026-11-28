import unittest

from calc import eh_par, limitar, soma


class TestCalc(unittest.TestCase):
    def test_soma(self):
        self.assertEqual(soma(2, 3), 5)

    def test_eh_par(self):
        self.assertTrue(eh_par(4))
        self.assertFalse(eh_par(7))

    def test_limitar(self):
        self.assertEqual(limitar(5, 0, 10), 5)
        self.assertEqual(limitar(-5, 0, 10), 0)
        self.assertEqual(limitar(50, 0, 10), 10)


if __name__ == "__main__":
    unittest.main()
